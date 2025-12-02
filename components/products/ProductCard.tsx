// // components/products/ProductCard.tsx
// 'use client'

// import { useMemo, useState } from 'react'
// import type { ListingWithProduct } from './ProductsList'
// import AddToCartBtn from '../AddToCartBtn'
// import ProductIcon from './ProductIcon'
// import type { Product as StoreProduct } from '@/type'
// // import ProductImage from './ProductImage'

// interface ProductCardProps {
//   listing: ListingWithProduct
//   // optional context from ProductsList for richer logging
//   searchQuery?: string
//   brand?: string
//   minPrice?: string
//   categoryId?: string
// }

// const ProductCard = ({ listing, searchQuery, brand, minPrice, categoryId }: ProductCardProps) => {
//   const { product, price } = listing
//   const [isLoggingView, setIsLoggingView] = useState(false)

//   // Map Prisma Product -> store Product (from type.ts)
//   const storeProduct: StoreProduct = useMemo(() => {
//     const p: any = product
//     const nowIso = new Date().toISOString()

//     return {
//       id: p.id,
//       title: p.name ?? p.title ?? 'Product',
//       description: p.description ?? '',
//       price: typeof p.price === 'number' ? p.price : Number(price),
//       brand: p.brand ?? '',
//       // Prisma Product has relations "category" / "subcategory"; we try name, fallback empty
//       category: p.category?.name ?? '',
//       discountPercentage: p.discountPercentage ?? 0,
//       availabilityStatus: p.availabilityStatus ?? 'In stock',
//       dimensions: {
//         width: p.width ?? 0,
//         height: p.height ?? 0,
//         depth: p.depth ?? 0,
//       },
//       meta: {
//         createdAt: p.createdAt?.toISOString?.() ?? nowIso,
//         updatedAt: p.updatedAt?.toISOString?.() ?? nowIso,
//         barcode: p.barcode ?? '',
//         qrCode: p.qrCode ?? '',
//       },
//       rating: p.rating ?? 0,
//       returnPolicy: p.returnPolicy ?? '',
//       reviews: Array.isArray(p.reviews) ? p.reviews : [],
//       shippingInformation: p.shippingInformation ?? '',
//       sku: p.sku ?? '',
//       stock: p.stock ?? 0,
//       tags: Array.isArray(p.tags) ? p.tags : [],
//       thumbnail: p.thumbnail ?? p.imageUrl ?? '',
//       images: Array.isArray(p.images) ? p.images : [],
//       minimumOrderQuantity: p.minimumOrderQuantity ?? 1,
//       warrantyInformation: p.warrantyInformation ?? '',
//       weight: p.weight ?? undefined,
//       quantity: 0,
//     }
//   }, [product, price])

//   const buildFilters = () => {
//     const filters: Record<string, any> = {}
//     if (brand) filters.brand = brand
//     if (minPrice) filters.minPrice = parseFloat(minPrice)
//     if (categoryId) filters.categoryId = parseInt(categoryId, 10)
//     return filters
//   }

//   const logViewEvent = async () => {
//     try {
//       const filters = buildFilters()

//       await fetch('/api/user-events/log', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           type: 'view_product',
//           listingId: listing.id,
//           productId: listing.productId,
//           query: searchQuery || null,
//           filters: Object.keys(filters).length > 0 ? filters : undefined,
//         }),
//       })
//       // backend skips logging if user is signed out
//     } catch (error) {
//       console.error('Failed to log view_product event:', error)
//     }
//   }

//   const handleCardClick = async () => {
//     if (isLoggingView) return
//     setIsLoggingView(true)

//     try {
//       await logViewEvent()
//     } finally {
//       setIsLoggingView(false)
//     }

//     // Later: router.push(`/products/${listing.id}`)
//   }

//   return (
//     <div
//       onClick={handleCardClick}
//       className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col group transition-transform duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer"
//     >
//       {/* Image / top section */}
//       <div className="w-full h-48 relative mb-4">
//         {/* <ProductImage src={storeProduct.thumbnail} alt={storeProduct.title} /> */}
//         <h1>TEMP_IMG</h1>

//         {/* Wishlist icon overlay – logs add/remove wishlist */}
//         <ProductIcon
//           discountPercentage={storeProduct.discountPercentage}
//           product={storeProduct}
//           listingId={listing.id}
//           searchQuery={searchQuery}
//           brand={brand}
//           minPrice={minPrice}
//           categoryId={categoryId}
//         />
//       </div>

//       {/* Text content */}
//       <div className="flex flex-col flex-grow">
//         <p className="text-sm text-gray-500 mb-1">{storeProduct.brand || 'Brand'}</p>
//         <h2
//           className="text-md font-semibold text-gray-800 truncate group-hover:text-amazon-blue_light"
//           title={storeProduct.title}
//         >
//           {storeProduct.title}
//         </h2>

//         <div className="mt-auto pt-2">
//           <p className="text-xl font-bold text-gray-900">${price.toString()}</p>
//         </div>

//         {/* Cart controls – uses global store & its own logging */}
//         <div className="mt-3">
//           <AddToCartBtn
//             product={storeProduct}
//             className="w-full"
//             listingId={listing.id}
//             searchQuery={searchQuery}
//             brand={brand}
//             minPrice={minPrice}
//             categoryId={categoryId}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductCard

// // components/products/ProductCard.tsx
// ;('use client')

// import { useMemo, useState } from 'react'
// import type { ListingWithProduct } from './ProductsList'
// import AddToCartBtn from '../AddToCartBtn'
// import ProductIcon from './ProductIcon'
// import type { Product as StoreProduct } from '@/type'
// // import ProductImage from './ProductImage'

// interface ProductCardProps {
//   listing: ListingWithProduct
//   searchQuery?: string
//   brand?: string
//   minPrice?: string
//   categoryId?: string
// }

// const ProductCard = ({ listing, searchQuery, brand, minPrice, categoryId }: ProductCardProps) => {
//   const { product, price } = listing
//   const [isLoggingView, setIsLoggingView] = useState(false)

//   const storeProduct: StoreProduct = useMemo(() => {
//     const p: any = product
//     const nowIso = new Date().toISOString()

//     return {
//       id: p.id,
//       title: p.name ?? p.title ?? 'Product',
//       description: p.description ?? '',
//       price: typeof p.price === 'number' ? p.price : Number(price),
//       brand: p.brand ?? '',
//       category: p.category?.name ?? '',
//       discountPercentage: p.discountPercentage ?? 0,
//       availabilityStatus: p.availabilityStatus ?? 'In stock',
//       dimensions: {
//         width: p.width ?? 0,
//         height: p.height ?? 0,
//         depth: p.depth ?? 0,
//       },
//       meta: {
//         createdAt: p.createdAt?.toISOString?.() ?? nowIso,
//         updatedAt: p.updatedAt?.toISOString?.() ?? nowIso,
//         barcode: p.barcode ?? '',
//         qrCode: p.qrCode ?? '',
//       },
//       rating: p.rating ?? 0,
//       returnPolicy: p.returnPolicy ?? '',
//       reviews: Array.isArray(p.reviews) ? p.reviews : [],
//       shippingInformation: p.shippingInformation ?? '',
//       sku: p.sku ?? '',
//       stock: p.stock ?? 0,
//       tags: Array.isArray(p.tags) ? p.tags : [],
//       thumbnail: p.thumbnail ?? p.imageUrl ?? '',
//       images: Array.isArray(p.images) ? p.images : [],
//       minimumOrderQuantity: p.minimumOrderQuantity ?? 1,
//       warrantyInformation: p.warrantyInformation ?? '',
//       weight: p.weight ?? undefined,
//       quantity: 0,
//     }
//   }, [product, price])

//   const buildFilters = () => {
//     const filters: Record<string, any> = {}
//     if (brand) filters.brand = brand
//     if (minPrice) filters.minPrice = parseFloat(minPrice)
//     if (categoryId) filters.categoryId = parseInt(categoryId, 10)
//     return filters
//   }

//   const logViewEvent = async () => {
//     try {
//       const filters = buildFilters()

//       await fetch('/api/user-events/log', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           type: 'view_product',
//           listingId: listing.id,
//           productId: listing.productId,
//           query: searchQuery || null,
//           filters: Object.keys(filters).length > 0 ? filters : undefined,
//         }),
//       })
//     } catch (error) {
//       console.error('Failed to log view_product event:', error)
//     }
//   }

//   const handleCardClick = async () => {
//     if (isLoggingView) return
//     setIsLoggingView(true)

//     try {
//       await logViewEvent()
//     } finally {
//       setIsLoggingView(false)
//     }
//   }

//   return (
//     <div
//       onClick={handleCardClick}
//       className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col group transition-transform duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer"
//     >
//       <div className="w-full h-48 relative mb-4">
//         {/* <ProductImage src={storeProduct.thumbnail} alt={storeProduct.title} /> */}
//         <h1>TEMP_IMG</h1>

//         <ProductIcon
//           discountPercentage={storeProduct.discountPercentage}
//           product={storeProduct}
//           listingId={listing.id}
//           searchQuery={searchQuery}
//           brand={brand}
//           minPrice={minPrice}
//           categoryId={categoryId}
//         />
//       </div>

//       <div className="flex flex-col flex-grow">
//         <p className="text-sm text-gray-500 mb-1">{storeProduct.brand || 'Brand'}</p>
//         <h2
//           className="text-md font-semibold text-gray-800 truncate group-hover:text-amazon-blue_light"
//           title={storeProduct.title}
//         >
//           {storeProduct.title}
//         </h2>

//         <div className="mt-auto pt-2">
//           <p className="text-xl font-bold text-gray-900">${price.toString()}</p>
//         </div>

//         <div className="mt-3">
//           <AddToCartBtn
//             product={storeProduct}
//             className="w-full"
//             listingId={listing.id}
//             searchQuery={searchQuery}
//             brand={brand}
//             minPrice={minPrice}
//             categoryId={categoryId}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductCard
// components/products/ProductCard.tsx
'use client'

import { useMemo, useState } from 'react'
import type { ListingWithProduct } from './ProductsList'
import AddToCartBtn from '../AddToCartBtn'
import ProductIcon from './ProductIcon'
import type { Product as StoreProduct } from '@/type'
// import ProductImage from './ProductImage'

interface ProductCardProps {
  listing: ListingWithProduct
  // optional context from ProductsList for richer logging
  searchQuery?: string
  brand?: string
  minPrice?: string
  categoryId?: string
}

const ProductCard = ({ listing, searchQuery, brand, minPrice, categoryId }: ProductCardProps) => {
  const { product, price } = listing
  const [isLoggingView, setIsLoggingView] = useState(false)

  // Map Prisma Product -> store Product (from type.ts)
  const storeProduct: StoreProduct = useMemo(() => {
    const p: any = product
    const nowIso = new Date().toISOString()

    return {
      id: p.id,
      title: p.name ?? p.title ?? 'Product',
      description: p.description ?? '',
      price: typeof p.price === 'number' ? p.price : Number(price),
      brand: p.brand ?? '',
      // Prisma Product has relations "category" / "subcategory"; we try name, fallback empty
      category: p.category?.name ?? '',
      discountPercentage: p.discountPercentage ?? 0,
      availabilityStatus: p.availabilityStatus ?? 'In stock',
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
      rating: p.rating ?? 0,
      returnPolicy: p.returnPolicy ?? '',
      reviews: Array.isArray(p.reviews) ? p.reviews : [],
      shippingInformation: p.shippingInformation ?? '',
      sku: p.sku ?? '',
      stock: p.stock ?? 0,
      tags: Array.isArray(p.tags) ? p.tags : [],
      thumbnail: p.thumbnail ?? p.imageUrl ?? '',
      images: Array.isArray(p.images) ? p.images : [],
      minimumOrderQuantity: p.minimumOrderQuantity ?? 1,
      warrantyInformation: p.warrantyInformation ?? '',
      weight: p.weight ?? undefined,
      quantity: 0,
    }
  }, [product, price])

  const buildFilters = () => {
    const filters: Record<string, any> = {}
    if (brand) filters.brand = brand
    if (minPrice) filters.minPrice = parseFloat(minPrice)
    if (categoryId) filters.categoryId = parseInt(categoryId, 10)
    return filters
  }

  const logViewEvent = async () => {
    try {
      const filters = buildFilters()

      await fetch('/api/user-events/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'view_product',
          listingId: listing.id,
          productId: listing.productId,
          query: searchQuery || null,
          filters: Object.keys(filters).length > 0 ? filters : undefined,
        }),
      })
      // backend skips logging if user is signed out
    } catch (error) {
      console.error('Failed to log view_product event:', error)
    }
  }

  const handleCardClick = async () => {
    if (isLoggingView) return
    setIsLoggingView(true)

    try {
      await logViewEvent()
    } finally {
      setIsLoggingView(false)
    }

    // Later: router.push(`/products/${listing.id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col group transition-transform duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      {/* Image / top section */}
      <div className="w-full h-48 relative mb-4">
        {/* <ProductImage src={storeProduct.thumbnail} alt={storeProduct.title} /> */}
        <h1>TEMP_IMG</h1>

        {/* Wishlist icon overlay – logs add/remove wishlist */}
        <ProductIcon
          discountPercentage={storeProduct.discountPercentage}
          product={storeProduct}
          listingId={listing.id}
          searchQuery={searchQuery}
          brand={brand}
          minPrice={minPrice}
          categoryId={categoryId}
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col flex-grow">
        <p className="text-sm text-gray-500 mb-1">{storeProduct.brand || 'Brand'}</p>
        <h2
          className="text-md font-semibold text-gray-800 truncate group-hover:text-amazon-blue_light"
          title={storeProduct.title}
        >
          {storeProduct.title}
        </h2>

        <div className="mt-auto pt-2">
          <p className="text-xl font-bold text-gray-900">${price.toString()}</p>
        </div>

        {/* Cart controls – uses global store & its own logging */}
        <div className="mt-3">
          <AddToCartBtn
            product={storeProduct}
            className="w-full"
            listingId={listing.id}
            searchQuery={searchQuery}
            brand={brand}
            minPrice={minPrice}
            categoryId={categoryId}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductCard
