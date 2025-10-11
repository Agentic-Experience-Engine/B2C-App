import ProductCard from './ProductCard'
import prisma from '@/lib/prisma'
import { Listing, Product, Prisma } from '@prisma/client'

export type ListingWithProduct = Listing & {
  product: Product
}

interface ProductListProps {
  categoryId?: string
  searchQuery?: string
  brand?: string
  minPrice?: string
}

const ProductsList = async ({ categoryId, searchQuery, brand, minPrice }: ProductListProps) => {
  const productWhereClause: Prisma.ProductWhereInput = {}

  if (searchQuery) {
    productWhereClause.OR = [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
    ]
  }
  if (categoryId) {
    productWhereClause.categoryId = parseInt(categoryId, 10)
  }
  if (brand) {
    productWhereClause.brand = brand
  }

  const listingWhereClause: Prisma.ListingWhereInput = {
    product: productWhereClause,
  }

  if (minPrice) {
    listingWhereClause.price = {
      gte: parseFloat(minPrice), // gte = "greater than or equal to"
    }
  }

  let listings: ListingWithProduct[] = []

  try {
    listings = await prisma.listing.findMany({
      where: listingWhereClause,
      include: {
        product: true,
      },
      take: 50,
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (error) {
    console.error('Internal Error', error)
  }

  return (
    <div className="flex-1">
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold">No Products Found</h2>
          <p className="text-gray-600 mt-2">Please adjust your filters or search term.</p>
        </div>
      )}
    </div>
  )
}

export default ProductsList
