import ProductCard from './ProductCard'
import prisma from '@/lib/prisma'
import { Listing, Product } from '@prisma/client'

export type ListingWithProduct = Listing & {
  product: Product
}

interface ProductListProps {
  categoryId?: string
}

const ProductsList = async ({ categoryId }: ProductListProps) => {
  let listings: ListingWithProduct[] = []

  try {
    listings = await prisma.listing.findMany({
      where: categoryId
        ? {
            product: {
              categoryId: parseInt(categoryId, 10),
            },
          }
        : {},
      include: {
        product: true,
      },
      take: 50,
    })
  } catch (error) {
    console.error('Internal Error', error)
  }

  return (
    <>
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold">No Products Found</h2>
          <p className="text-gray-600 mt-2">Please try another category.</p>
        </div>
      )}
    </>
  )
}

export default ProductsList
