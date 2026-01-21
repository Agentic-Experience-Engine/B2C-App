import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentAppUserId } from '@/lib/auth/getCurrentAppUserId'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const userId = await getCurrentAppUserId()

    if (!userId) {
      return NextResponse.json(
        { items: [] as { listingId: number; quantity: number }[], totalQuantity: 0 },
        { status: 200 },
      )
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    })

    if (!cart) {
      return NextResponse.json(
        { items: [] as { listingId: number; quantity: number }[], totalQuantity: 0 },
        { status: 200 },
      )
    }

    const items = cart.items.map((item) => ({
      listingId: item.listingId,
      quantity: item.quantity,
    }))

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

    return NextResponse.json({ items, totalQuantity })
  } catch (error) {
    console.error('Failed to load cart summary:', error)
    return NextResponse.json(
      { items: [] as { listingId: number; quantity: number }[], totalQuantity: 0 },
      { status: 500 },
    )
  }
}
