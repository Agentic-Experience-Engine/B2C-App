// app/api/orders/place/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentAppUserId } from '@/lib/auth/getCurrentAppUserId'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const userId = await getCurrentAppUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // ✅ NEW: log what DB this route is actually connected to
    const dbInfo = await prisma.$queryRaw<{ db: string; schema: string; host: string | null; port: number | null }[]>`
      SELECT
        current_database() as db,
        current_schema() as schema,
        inet_server_addr()::text as host,
        inet_server_port() as port
    `

    const maxId = await prisma.$queryRaw<{ max: number | null }[]>`
      SELECT MAX(id)::int as max FROM "Order"
    `

    const seqState = await prisma.$queryRaw<{ last: number; is_called: boolean }[]>`
      SELECT last_value::int as last, is_called FROM "Order_id_seq"
    `

    console.log('🧭 DB CHECK:', {
      dbInfo: dbInfo[0],
      orderMaxId: maxId[0]?.max,
      orderSeq: seqState[0],
    })

    const body = await req.json()

    const items: {
      productId: number
      listingId: number
      quantity: number
      price: number
    }[] = body.items || []

    const subtotal: number = body.subtotal

    console.log('📦 /api/orders/place payload:', { userId, items, subtotal })

    if (!items.length) {
      return NextResponse.json({ error: 'No items to place order' }, { status: 400 })
    }

    // Validate listingIds exist
    const listingIds = items.map((i) => i.listingId)
    const listings = await prisma.listing.findMany({
      where: { id: { in: listingIds } },
      select: { id: true, price: true },
    })

    const listingMap = new Map<number, Prisma.Decimal>()
    listings.forEach((l) => listingMap.set(l.id, l.price))

    for (const item of items) {
      if (!listingMap.has(item.listingId)) {
        return NextResponse.json({ error: `Invalid listingId ${item.listingId} in order items` }, { status: 400 })
      }
    }

    // ✅ NEW: transaction (optional but good practice)
    const order = await prisma.$transaction(async (tx) => {
      return tx.order.create({
        data: {
          userId,
          totalAmount: new Prisma.Decimal(subtotal),
          status: 'PLACED',
          items: {
            create: items.map((item) => ({
              listingId: item.listingId,
              quantity: item.quantity,
              priceEach: new Prisma.Decimal(item.price),
            })),
          },
        },
        include: { items: true },
      })
    })

    console.log('✅ Order created with id:', order.id)
    return NextResponse.json({ order })
  } catch (error: any) {
    // ✅ NEW: return useful Prisma error info
    console.error('❌ Failed to place order:', error)

    if (error?.code === 'P2002') {
      return NextResponse.json(
        {
          error: 'Unique constraint failed',
          code: error.code,
          target: error?.meta?.target,
          model: error?.meta?.modelName,
        },
        { status: 409 },
      )
    }

    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}
