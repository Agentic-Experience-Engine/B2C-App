import ProductCard from './ProductCard'
import { cookies } from 'next/headers'
import type { Listing, Product } from '@prisma/client'

export type ListingWithProduct = Listing & {
  product: Product
}

interface ProductListProps {
  categoryId?: string
  searchQuery?: string
  brand?: string
  minPrice?: string
}

const ProductsList = async ({ searchQuery, brand, minPrice, categoryId }: ProductListProps) => {
  console.log('[ProductsList] Fetching via /api/search')
  console.log('[ProductsList] searchQuery:', searchQuery)

  const cookieStore = cookies()

  let listings: ListingWithProduct[] = []

  try {
    const params = new URLSearchParams()

    if (searchQuery) params.set('query', searchQuery)
    if (brand) params.set('brand', brand)
    if (minPrice) params.set('minPrice', minPrice)
    if (categoryId) params.set('categoryId', categoryId)

    const res = await fetch(`${process.env.NEXT_AUTH_URL ?? ''}/api/search?${params.toString()}`, {
      headers: {
        cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('[ProductsList] Search API failed')
      return listings
    }

    listings = await res.json()
  } catch (error) {
    console.error('[ProductsList] Unexpected error:', error)
  }

  return (
    <div className="flex-1">
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ProductCard
              key={listing.id}
              listing={listing}
              searchQuery={searchQuery}
              brand={brand}
              minPrice={minPrice}
              categoryId={categoryId}
            />
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
