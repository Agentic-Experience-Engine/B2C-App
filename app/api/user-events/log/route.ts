// app/api/user-events/log/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentAppUserId } from '@/lib/auth/getCurrentAppUserId'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const appUserId = await getCurrentAppUserId()

    if (!appUserId) {
      // Not logged in – don't log, but don't break UI
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = (await req.json().catch(() => null)) as {
      type?: string
      listingId?: number | null
      productId?: number | null
      query?: string | null
      filters?: any
    } | null

    if (!body || !body.type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 })
    }

    const { type, listingId, productId, query, filters } = body

    const event = await prisma.userEvent.create({
      data: {
        userId: appUserId,
        type, // 'view_product', 'add_to_cart', 'remove_from_cart', 'add_to_wishlist', 'remove_from_wishlist', 'search'
        listingId: listingId ?? null,
        productId: productId ?? null,
        query: query ?? null,
        filters: filters ?? undefined,
        // timestamp auto via @default(now())
      },
    })

    console.log('Logged UserEvent:', {
      id: event.id,
      userId: appUserId,
      type,
      listingId,
      productId,
      query,
      filters,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to log user event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
