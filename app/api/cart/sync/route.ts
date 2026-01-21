// app/api/cart/sync/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentAppUserId } from '@/lib/auth/getCurrentAppUserId'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const userId = await getCurrentAppUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { listingId, quantity } = await req.json()
    if (!listingId || quantity == null) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // 🔥 Use findFirst instead of findUnique
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    })

    // 🔥 EXTRA fallback for Supabase metadata mismatch:
    if (!cart) {
      console.log('Checking raw DB for existing cart…')

      const raw = await prisma.$queryRawUnsafe<any[]>(`SELECT id FROM "Cart" WHERE "userId" = ${userId} LIMIT 1`)

      if (Array.isArray(raw) && raw.length > 0) {
        console.log('Raw DB shows cart exists → loading via Prisma')

        cart = await prisma.cart.findFirst({
          where: { userId },
          include: { items: true },
        })
      }
    }

    // 🔥 Create cart only when absolutely sure it does NOT exist
    if (!cart && quantity > 0) {
      console.log('Creating fresh cart for user:', userId)
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      })
    }

    if (!cart) {
      return NextResponse.json({ success: true })
    }

    // Check existing item
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, listingId },
    })

    // REMOVE ITEM
    if (quantity === 0) {
      if (existingItem) {
        await prisma.cartItem.delete({
          where: { id: existingItem.id },
        })
      }

      const remaining = await prisma.cartItem.count({
        where: { cartId: cart.id },
      })

      if (remaining === 0) {
        await prisma.cart.delete({ where: { id: cart.id } })
      }

      return NextResponse.json({ success: true })
    }

    // ADD OR UPDATE ITEM
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          listingId,
          quantity,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ Cart sync error:', err)
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 })
  }
}
