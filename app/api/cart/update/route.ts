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

    const body = (await req.json().catch(() => null)) as { listingId?: number; quantity?: number } | null

    if (!body?.listingId || body.quantity === undefined || body.quantity === null) {
      return NextResponse.json({ error: 'listingId and quantity are required' }, { status: 400 })
    }

    const { listingId, quantity } = body

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    })
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    })

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          listingId,
        },
      })
    } else {
      const existing = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          listingId,
        },
      })

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
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
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update cart:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
