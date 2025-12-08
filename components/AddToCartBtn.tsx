// 'use client'

// import { useEffect, useState } from 'react'
// import { Product as StoreProduct } from '@/type'
// import { store } from '@/lib/store'
// import { cn } from '@/lib/utils'
// import { FaMinus, FaPlus } from 'react-icons/fa'
// import toast from 'react-hot-toast'

// interface Props {
//   product: StoreProduct
//   className?: string
//   title?: string
//   showPrice?: boolean
//   listingId?: number
//   searchQuery?: string
//   brand?: string
//   minPrice?: string
//   categoryId?: string
// }

// const AddToCartBtn = ({ product, className, listingId, searchQuery, brand, minPrice, categoryId }: Props) => {
//   const { addToCart, cartProduct, decreaseQuantity } = store()
//   const [existingProduct, setExistingProduct] = useState<StoreProduct | null>(null)

//   useEffect(() => {
//     const availableItem = cartProduct.find((item) => item?.id === product?.id)
//     setExistingProduct((availableItem as StoreProduct) || null)
//   }, [product, cartProduct])

//   const buildFilters = (quantity: number) => {
//     const filters: Record<string, any> = {
//       source: 'product_card',
//       quantity,
//       price: product.price,
//       title: product.title,
//       brand: product.brand,
//       category: product.category,
//     }
//     if (brand) filters.searchBrand = brand
//     if (minPrice) filters.searchMinPrice = parseFloat(minPrice)
//     if (categoryId) filters.searchCategoryId = parseInt(categoryId, 10)
//     return filters
//   }

//   const logUserEvent = async (type: 'add_to_cart' | 'remove_from_cart', quantity: number) => {
//     try {
//       const filters = buildFilters(quantity)

//       await fetch('/api/user-events/log', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           type,
//           productId: product.id,
//           listingId: listingId ?? null,
//           query: searchQuery || null,
//           filters,
//         }),
//       })
//     } catch (err) {
//       console.error(`Failed to log ${type} event:`, err)
//     }
//   }

//   const handleAddToCart = (e?: any) => {
//     e?.stopPropagation?.()
//     if (!product) return

//     const prevQty = existingProduct?.quantity ?? 0

//     addToCart(product as any)

//     const newQty = prevQty + 1

//     if (prevQty === 0) {
//       void logUserEvent('add_to_cart', newQty)
//     }

//     toast.success(`${product?.title.substring(0, 12)}... added successfully!`)
//   }

//   const handleDeleteProduct = (e: any) => {
//     e?.stopPropagation?.()
//     if (!existingProduct) return

//     const prevQty = existingProduct.quantity ?? 1

//     decreaseQuantity(existingProduct.id)

//     const newQty = prevQty - 1

//     if (newQty > 0) {
//       toast.success(`${product?.title.substring(0, 10)} decreased successfully`)
//     } else {
//       toast.success(`${product?.title.substring(0, 10)} removed from cart successfully`)
//       void logUserEvent('remove_from_cart', 0)
//     }
//   }

//   const quantity = existingProduct?.quantity ?? 0

//   return (
//     <>
//       {quantity > 0 ? (
//         <div className="flex self-start items-center justify-center gap-2 py-2 mb-2">
//           <button
//             onClick={handleDeleteProduct}
//             className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-sm hover:bg-white duration-200 cursor-pointer"
//           >
//             <FaMinus />
//           </button>
//           <p className="text-base font-semibold w-10 text-center">{quantity}</p>
//           <button
//             onClick={handleAddToCart}
//             className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-sm hover:bg-white duration-200 cursor-pointer"
//           >
//             <FaPlus />
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={handleAddToCart}
//           className={cn(
//             'text-sm tracking-wide font-medium mb-2 border-[1px] border-amazonBlue/50 py-2 rounded-full bg-amazonLight/10 hover:bg-amazonYellowDark duration-200',
//             className,
//           )}
//         >
//           Add to cart
//         </button>
//       )}
//     </>
//   )
// }

// export default AddToCartBtn

// components/AddToCartBtn.tsx
'use client'

import { useEffect, useState } from 'react'
import { Product as StoreProduct } from '@/type'
import { store } from '@/lib/store'
import { cn } from '@/lib/utils'
import { FaMinus, FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface Props {
  product: StoreProduct
  className?: string
  title?: string
  showPrice?: boolean
  listingId?: number
  searchQuery?: string
  brand?: string
  minPrice?: string
  categoryId?: string
}

const AddToCartBtn = ({ product, className, listingId, searchQuery, brand, minPrice, categoryId }: Props) => {
  const { addToCart, cartProduct, decreaseQuantity } = store()
  const [existingProduct, setExistingProduct] = useState<StoreProduct | null>(null)

  useEffect(() => {
    const availableItem = cartProduct.find((item) => item?.id === product?.id)
    setExistingProduct((availableItem as StoreProduct) || null)
  }, [product, cartProduct])

  const buildFilters = (quantity: number) => {
    const filters: Record<string, any> = {
      source: 'product_card',
      quantity,
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

  const logUserEvent = async (type: 'add_to_cart' | 'remove_from_cart', quantity: number) => {
    try {
      const filters = buildFilters(quantity)

      await fetch('/api/user-events/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          productId: product.id,
          listingId: listingId ?? null,
          query: searchQuery || null,
          filters,
        }),
      })
    } catch (err) {
      console.error(`Failed to log ${type} event:`, err)
    }
  }

  const handleAddToCart = (e?: any) => {
    e?.stopPropagation?.()
    if (!product) return

    const prevQty = existingProduct?.quantity ?? 0

    // 👉 attach listingId when storing in cart
    const productWithListing: StoreProduct = {
      ...product,
      listingId: listingId ?? product.listingId,
    }

    addToCart(productWithListing as any)

    const newQty = prevQty + 1

    if (prevQty === 0) {
      void logUserEvent('add_to_cart', newQty)
    }

    toast.success(`${product?.title.substring(0, 12)}... added successfully!`)
  }

  const handleDeleteProduct = (e: any) => {
    e?.stopPropagation?.()
    if (!existingProduct) return

    const prevQty = existingProduct.quantity ?? 1

    decreaseQuantity(existingProduct.id)

    const newQty = prevQty - 1

    if (newQty > 0) {
      toast.success(`${product?.title.substring(0, 10)} decreased successfully`)
    } else {
      toast.success(`${product?.title.substring(0, 10)} removed from cart successfully`)
      void logUserEvent('remove_from_cart', 0)
    }
  }

  const quantity = existingProduct?.quantity ?? 0

  return (
    <>
      {quantity > 0 ? (
        <div className="flex self-start items-center justify-center gap-2 py-2 mb-2">
          <button
            onClick={handleDeleteProduct}
            className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-sm hover:bg-white duration-200 cursor-pointer"
          >
            <FaMinus />
          </button>
          <p className="text-base font-semibold w-10 text-center">{quantity}</p>
          <button
            onClick={handleAddToCart}
            className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-sm hover:bg-white duration-200 cursor-pointer"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className={cn(
            'text-sm tracking-wide font-medium mb-2 border-[1px] border-amazonBlue/50 py-2 rounded-full bg-amazonLight/10 hover:bg-amazonYellowDark duration-200',
            className,
          )}
        >
          Add to cart
        </button>
      )}
    </>
  )
}

export default AddToCartBtn
