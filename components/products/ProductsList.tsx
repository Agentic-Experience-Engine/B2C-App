// // components/products/ProductsList.tsx
// import prisma from '@/lib/prisma'
// import ProductCard from './ProductCard'
// import { Product, Prisma } from '@prisma/client'
// import { getCurrentAppUserId } from '@/lib/auth/getCurrentAppUserId'

// // Client-safe type we pass to ProductCard
// export type ListingWithProduct = {
//   id: number
//   productId: number
//   price: number // number, not Prisma.Decimal
//   product: Product
// }

// interface ProductListProps {
//   categoryId?: string
//   searchQuery?: string
//   brand?: string
//   minPrice?: string
// }

// const ProductsList = async ({ categoryId, searchQuery, brand, minPrice }: ProductListProps) => {
//   const productWhereClause: Prisma.ProductWhereInput = {}

//   // Text search on product name/description
//   if (searchQuery) {
//     productWhereClause.OR = [
//       { name: { contains: searchQuery, mode: 'insensitive' } },
//       { description: { contains: searchQuery, mode: 'insensitive' } },
//     ]
//   }

//   // Filter by category
//   if (categoryId) {
//     productWhereClause.categoryId = parseInt(categoryId, 10)
//   }

//   // Filter by brand
//   if (brand) {
//     productWhereClause.brand = brand
//   }

//   const listingWhereClause: Prisma.ListingWhereInput = {
//     product: productWhereClause,
//   }

//   // Filter by minimum price on the listing
//   if (minPrice) {
//     listingWhereClause.price = {
//       gte: parseFloat(minPrice),
//     }
//   }

//   // Build filters JSON for logging
//   const filters: Record<string, any> = {}
//   if (brand) filters.brand = brand
//   if (minPrice) filters.minPrice = parseFloat(minPrice)
//   if (categoryId) filters.categoryId = parseInt(categoryId, 10)

//   // ---- Log a "search" UserEvent (server-side) ------------------------
//   try {
//     const appUserId = await getCurrentAppUserId()

//     if (appUserId && (searchQuery || Object.keys(filters).length > 0)) {
//       await prisma.userEvent.create({
//         data: {
//           userId: appUserId,
//           type: 'search',
//           query: searchQuery || null,
//           filters: Object.keys(filters).length > 0 ? filters : undefined,
//         },
//       })

//       console.log('Logged UserEvent for search:', {
//         userId: appUserId,
//         query: searchQuery,
//         filters,
//       })
//     }
//   } catch (logError) {
//     console.error('Failed to log UserEvent search:', logError)
//   }

//   // ---- Fetch listings + products from DB -----------------------------
//   let listings: ListingWithProduct[] = []

//   try {
//     const dbListings = await prisma.listing.findMany({
//       where: listingWhereClause,
//       include: {
//         product: true,
//       },
//       take: 50,
//       orderBy: {
//         createdAt: 'desc',
//       },
//     })

//     // Convert Prisma.Decimal -> number for client safety
//     listings = dbListings.map((l) => ({
//       id: l.id,
//       productId: l.productId,
//       price: Number(l.price),
//       product: l.product,
//     }))
//   } catch (error) {
//     console.error('Internal Error fetching listings:', error)
//   }

//   // ---- Render --------------------------------------------------------
//   return (
//     <div className="flex-1">
//       {listings.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {listings.map((listing) => (
//             <ProductCard
//               key={listing.id}
//               listing={listing}
//               searchQuery={searchQuery}
//               brand={brand}
//               minPrice={minPrice}
//               categoryId={categoryId}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-10">
//           <h2 className="text-2xl font-semibold">No Products Found</h2>
//           <p className="text-gray-600 mt-2">Please adjust your filters or search term.</p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ProductsList
// components/products/ProductsList.tsx
import prisma from '@/lib/prisma'
import ProductCard from './ProductCard'
import { Prisma, Product as PrismaProduct } from '@prisma/client'
import { getCurrentAppUserId } from '@/lib/auth/getCurrentAppUserId'

export type ListingWithProduct = {
  id: number
  productId: number
  price: number
  product: PrismaProduct
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
      gte: parseFloat(minPrice),
    }
  }

  const filters: Record<string, any> = {}
  if (brand) filters.brand = brand
  if (minPrice) filters.minPrice = parseFloat(minPrice)
  if (categoryId) filters.categoryId = parseInt(categoryId, 10)

  try {
    const appUserId = await getCurrentAppUserId()

    if (appUserId && (searchQuery || Object.keys(filters).length > 0)) {
      await prisma.userEvent.create({
        data: {
          userId: appUserId,
          type: 'search',
          query: searchQuery || null,
          filters: Object.keys(filters).length > 0 ? filters : undefined,
        },
      })
    }
  } catch (logError) {
    console.error('Failed to log UserEvent search:', logError)
  }

  let listings: ListingWithProduct[] = []

  try {
    const dbListings = await prisma.listing.findMany({
      where: listingWhereClause,
      include: {
        product: true,
      },
      take: 50,
      orderBy: {
        createdAt: 'desc',
      },
    })

    listings = dbListings.map((l) => ({
      id: l.id,
      productId: l.productId,
      price: Number(l.price),
      product: l.product,
    }))
  } catch (error) {
    console.error('Internal Error fetching listings:', error)
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
