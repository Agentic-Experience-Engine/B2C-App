// import ProductCard from './ProductCard'
// import prisma from '@/lib/prisma'
// import { Listing, Product, Prisma } from '@prisma/client'

// export type ListingWithProduct = Listing & {
//   product: Product
// }

// interface ProductListProps {
//   categoryId?: string
//   searchQuery?: string
//   brand?: string
//   minPrice?: string
// }

// // TODO: change this to the real logged-in user later
// const TEST_USER_ID = 1

// const ProductsList = async ({ categoryId, searchQuery, brand, minPrice }: ProductListProps) => {
//   const productWhereClause: Prisma.ProductWhereInput = {}

//   if (searchQuery) {
//     productWhereClause.OR = [
//       { name: { contains: searchQuery, mode: 'insensitive' } },
//       { description: { contains: searchQuery, mode: 'insensitive' } },
//     ]
//   }

//   if (categoryId) {
//     productWhereClause.categoryId = parseInt(categoryId, 10)
//   }

//   if (brand) {
//     productWhereClause.brand = brand
//   }

//   const listingWhereClause: Prisma.ListingWhereInput = {
//     product: productWhereClause,
//   }

//   if (minPrice) {
//     listingWhereClause.price = {
//       gte: parseFloat(minPrice),
//     }
//   }

//   // 🔹 Build filters JSON for logging
//   const filters: Record<string, any> = {}
//   if (brand) filters.brand = brand
//   if (minPrice) filters.minPrice = parseFloat(minPrice)
//   if (categoryId) filters.categoryId = parseInt(categoryId, 10)

//   // 🔹 Log user event (best-effort, won't break page if it fails)
//   try {
//     if (searchQuery || Object.keys(filters).length > 0) {
//       await prisma.userEvent.create({
//         data: {
//           userId: TEST_USER_ID, // make sure this user exists in your User table
//           type: 'search',
//           query: searchQuery || null,
//           filters: Object.keys(filters).length > 0 ? filters : undefined,
//           // listingId, productId are null for search events
//         },
//       })
//       console.log('Logged UserEvent for search:', {
//         userId: TEST_USER_ID,
//         query: searchQuery,
//         filters,
//       })
//     }
//   } catch (logError) {
//     console.error('Failed to log UserEvent search:', logError)
//     // swallow error – we don't want logging to break the page
//   }

//   let listings: ListingWithProduct[] = []

//   try {
//     listings = await prisma.listing.findMany({
//       where: listingWhereClause,
//       include: {
//         product: true,
//       },
//       take: 50,
//       orderBy: {
//         createdAt: 'desc',
//       },
//     })
//   } catch (error) {
//     console.error('Internal Error', error)
//   }

//   return (
//     <div className="flex-1">
//       {listings.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {listings.map((listing) => (
//             <ProductCard key={listing.id} listing={listing} />
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
import ProductCard from './ProductCard'
import prisma from '@/lib/prisma'
import { Listing, Product, Prisma } from '@prisma/client'
import { getCurrentAppUserId } from '@/lib/auth/getCurrentAppUserId'

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
      gte: parseFloat(minPrice),
    }
  }

  const filters: Record<string, any> = {}
  if (brand) filters.brand = brand
  if (minPrice) filters.minPrice = parseFloat(minPrice)
  if (categoryId) filters.categoryId = parseInt(categoryId, 10)

  // 👇 This will internally use your UserAuthentication.authId -> userId mapping
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

      console.log('Logged UserEvent for search:', {
        userId: appUserId,
        query: searchQuery,
        filters,
      })
    }
  } catch (logError) {
    console.error('Failed to log UserEvent search:', logError)
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
