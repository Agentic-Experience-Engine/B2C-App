// app/api/orders/place/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentAppUserId } from '@/lib/auth/getCurrentAppUserId'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const userId = await getCurrentAppUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            listing: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + Number(item.listing.price) * item.quantity, 0)

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PLACED',
          items: {
            create: cart.items.map((item) => ({
              listingId: item.listingId,
              quantity: item.quantity,
              priceEach: item.listing.price,
            })),
          },
        },
      })

      // Clear cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      })

      return order
    })

    return NextResponse.json({ success: true, orderId: result.id })
  } catch (error) {
    console.error('Failed to place order:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
