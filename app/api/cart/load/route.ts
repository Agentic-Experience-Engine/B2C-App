// app/api/cart/load/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentAppUserId } from '@/lib/auth/getCurrentAppUserId'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const userId = await getCurrentAppUserId()
    if (!userId) {
      return NextResponse.json({ items: [] }, { status: 200 })
    }
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

    // Map DB cart → your Product type (with listingId + quantity)
    const items = cart.items.map((item) => {
      const listing = item.listing
      const p = listing.product as any

      const nowIso = new Date().toISOString()

      return {
        id: p.id,
        listingId: listing.id,
        title: p.name ?? p.title ?? 'Product',
        description: p.description ?? '',
        price: Number(listing.price),
        brand: p.brand ?? '',
        category: String(p.categoryId ?? ''),

        availabilityStatus: 'In stock',
        discountPercentage: 0,
        dimensions: {
          width: p.width ?? 0,
          height: p.height ?? 0,
          depth: p.depth ?? 0,
        },
        meta: {
          createdAt: p.createdAt?.toISOString?.() ?? nowIso,
          updatedAt: p.updatedAt?.toISOString?.() ?? nowIso,
          barcode: p.barcode ?? '',
          qrCode: p.qrCode ?? '',
        },
        rating: p.averageRating ?? 0,
        returnPolicy: p.returnPolicy ?? '',
        reviews: Array.isArray(p.reviews) ? p.reviews : [],
        shippingInformation: p.shippingInformation ?? '',
        sku: p.sku ?? '',
        stock: listing.stockQty ?? 0,
        tags: Array.isArray(p.keywords) ? p.keywords : [],
        thumbnail: p.imageUrl ?? '',
        images: p.imageUrl ? [p.imageUrl] : [],
        minimumOrderQuantity: p.minimumOrderQuantity ?? 1,
        warrantyInformation: p.warrantyInformation ?? '',
        weight: p.weight ?? undefined,

        quantity: item.quantity ?? 1,
      }
    })

    return NextResponse.json({ items })
  } catch (err) {
    console.error('❌ Failed to load cart:', err)
    return NextResponse.json({ error: 'Failed to load cart' }, { status: 500 })
  }
}
