// app/api/cart/get/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentAppUserId } from '@/lib/auth/getCurrentAppUserId'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const userId = await getCurrentAppUserId()
    if (!userId) {
      return NextResponse.json({ items: [] }) // not logged in → empty cart
    }

    // Fetch user cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            listing: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({ items: [] })
    }

    // Convert Prisma → Zustand product format
    const formatted = cart.items.map((item) => {
      const p = item.listing.product

      return {
        id: p.id,
        listingId: item.listing.id,
        title: p.name,
        price: Number(item.listing.price),
        brand: p.brand ?? '',
        category: p.categoryId ?? '',
        description: p.description ?? '',
        images: [],
        thumbnail: p.imageUrl ?? '',
        quantity: item.quantity,
        availabilityStatus: 'In stock',
        discountPercentage: 0,
        dimensions: { width: 0, height: 0, depth: 0 },
        meta: {
          createdAt: '',
          updatedAt: '',
          barcode: '',
          qrCode: '',
        },
        rating: 0,
        returnPolicy: '',
        reviews: [],
        shippingInformation: '',
        sku: '',
        stock: 0,
        tags: [],
        minimumOrderQuantity: 1,
        warrantyInformation: '',
      }
    })

    return NextResponse.json({ items: formatted })
  } catch (err) {
    console.error('❌ GET CART ERROR:', err)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}
