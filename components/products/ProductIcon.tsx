// 'use client'
// import { Product } from '@/type'
// import { useEffect, useState } from 'react'
// import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
// import { store } from '@/lib/store'
// import toast from 'react-hot-toast'

// interface Props {
//   discountPercentage: number
//   product: Product
// }

// const ProductIcon = ({ discountPercentage, product }: Props) => {
//   const { favoriteProduct, addToFavorite } = store()
//   const [existingProduct, setExistingProduct] = useState<Product | null>(null)

//   useEffect(() => {
//     const availableItem = favoriteProduct.find((item) => item?.id === product?.id)
//     setExistingProduct(availableItem || null)
//   }, [product, favoriteProduct])

//   const handleFavorite = (e: any) => {
//     e.preventDefault()
//     if (product) {
//       addToFavorite(product).then(() => {
//         toast.success(
//           existingProduct
//             ? `${product?.title.substring(0, 10)} removed successfully!`
//             : `${product?.title.substring(0, 10)} added successfully!`,
//         )
//       })
//     }
//   }
//   return (
//     <div className="absolute top-2 right-2 flex items-center gap-2">
//       <p className="bg-transparent text-amazonBlue border border-amazonBlue group-hover:bg-amazonBlue group-hover:text-white duration-200 text-xs rounded-full py-1 px-2">
//         {discountPercentage}%
//       </p>
//       <span onClick={handleFavorite} className="text-xl z-40">
//         {existingProduct ? <MdFavorite /> : <MdFavoriteBorder />}
//       </span>
//     </div>
//   )
// }

// export default ProductIcon
// components/products/ProductIcon.tsx
'use client'

import { Product } from '@/type'
import { useEffect, useState } from 'react'
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import { store } from '@/lib/store'
import toast from 'react-hot-toast'

interface Props {
  discountPercentage: number
  product: Product
  listingId?: number
  searchQuery?: string
  brand?: string
  minPrice?: string
  categoryId?: string
}

const ProductIcon = ({ discountPercentage, product, listingId, searchQuery, brand, minPrice, categoryId }: Props) => {
  const { favoriteProduct, addToFavorite } = store()
  const [existingProduct, setExistingProduct] = useState<Product | null>(null)

  useEffect(() => {
    const availableItem = favoriteProduct.find((item) => item?.id === product?.id)
    setExistingProduct(availableItem || null)
  }, [product, favoriteProduct])

  const buildFilters = (favorite: boolean) => {
    const filters: Record<string, any> = {
      favorite,
      discountPercentage,
      price: product.price,
      title: product.title,
      brand: product.brand,
      category: product.category,
    }
    if (brand) filters.searchBrand = brand
    if (minPrice) filters.searchMinPrice = parseFloat(minPrice)
    if (categoryId) filters.searchCategoryId = parseInt(categoryId, 10)
    return filters
  }

  const logWishlistEvent = async (type: 'add_to_wishlist' | 'remove_from_wishlist', isFavorite: boolean) => {
    try {
      const filters = buildFilters(isFavorite)

      await fetch('/api/user-events/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          productId: product.id,
          listingId: listingId ?? null,
          query: searchQuery || null,
          filters,
        }),
      })
    } catch (error) {
      console.error(`Failed to log ${type} event:`, error)
    }
  }

  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    e.stopPropagation() // don't trigger view_product on card

    if (!product) return

    const willRemove = !!existingProduct

    addToFavorite(product).then(() => {
      if (willRemove) {
        toast.success(`${product?.title.substring(0, 10)} removed from wishlist!`)
        logWishlistEvent('remove_from_wishlist', false)
      } else {
        toast.success(`${product?.title.substring(0, 10)} added to wishlist!`)
        logWishlistEvent('add_to_wishlist', true)
      }
    })
  }

  return (
    <div className="absolute top-2 right-2 flex items-center gap-2">
      <p className="bg-transparent text-amazonBlue border border-amazonBlue group-hover:bg-amazonBlue group-hover:text-white duration-200 text-xs rounded-full py-1 px-2">
        {discountPercentage}%
      </p>
      <span onClick={handleFavorite} className="text-xl z-40 cursor-pointer">
        {existingProduct ? <MdFavorite /> : <MdFavoriteBorder />}
      </span>
    </div>
  )
}

export default ProductIcon
