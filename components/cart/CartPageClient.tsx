// components/cart/CartPageClient.tsx
'use client'

import { store } from '@/lib/store'
import { FaMinus, FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const CartPageClient = () => {
  const { cartProduct, addToCart, decreaseQuantity, resetCart } = store()
  const router = useRouter()

  const subtotal = cartProduct.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
  const totalQuantity = cartProduct.reduce((sum, item) => sum + (item.quantity || 1), 0)

  const logUserEvent = async (type: 'remove_from_cart', payload: any) => {
    try {
      await fetch('/api/user-events/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          productId: payload.productId ?? null,
          listingId: payload.listingId ?? null,
          query: null,
          filters: payload,
        }),
      })
    } catch (err) {
      console.error(`Failed to log ${type} event:`, err)
    }
  }

  const handleIncrease = (id: number) => {
    const item = cartProduct.find((p) => p.id === id)
    if (item) {
      addToCart(item)
    }
  }

  const handleDecrease = (id: number) => {
    const item = cartProduct.find((p) => p.id === id)
    if (!item) return

    const currentQty = item.quantity ?? 1

    if (currentQty > 1) {
      decreaseQuantity(id)
      toast.success(`${item.title.substring(0, 10)} decreased successfully`)
    } else {
      // currentQty === 1 -> remove from cart
      decreaseQuantity(id)

      toast.success(`${item.title.substring(0, 10)} removed from cart successfully`)

      void logUserEvent('remove_from_cart', {
        productId: item.id,
        listingId: (item as any).listingId ?? null,
        title: item.title,
        price: item.price,
        brand: (item as any).brand,
        quantity: 0,
        source: 'cart_page',
      })
    }
  }

  const handlePlaceOrder = async () => {
    if (cartProduct.length === 0) {
      toast.error('Your cart is empty.')
      return
    }

    // Each item MUST have listingId to create OrderItem
    const orderItems = cartProduct.map((item) => {
      const listingId = (item as any).listingId as number | undefined
      return {
        productId: item.id,
        listingId,
        quantity: item.quantity || 1,
        price: item.price || 0,
        title: item.title,
        brand: (item as any).brand,
      }
    })

    const missingListing = orderItems.find((i) => !i.listingId)
    if (missingListing) {
      console.error('Missing listingId for item in cart:', missingListing)
      toast.error('Some items cannot be ordered (missing listingId).')
      return
    }

    try {
      const res = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems.map((i) => ({
            productId: i.productId,
            listingId: i.listingId,
            quantity: i.quantity,
            price: i.price,
          })),
          subtotal,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error('Order API error:', err)
        toast.error('Failed to place order. Please try again.')
        return
      }

      // ⛔ No order_placed user-event logging here

      // Clear cart state WITHOUT triggering any remove_from_cart logs
      resetCart()

      toast.success('Order placed successfully! Redirecting to homepage...')

      setTimeout(() => {
        router.push('/')
      }, 4000)
    } catch (error) {
      console.error('Failed to place order:', error)
      toast.error('Failed to place order. Please try again.')
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left: items */}
      <div className="flex-1">
        {cartProduct.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartProduct.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b pb-4">
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-xs text-gray-400">IMG</div>

                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">{item.title}</h2>
                  <p className="text-sm text-gray-500">
                    {(item as any).brand && <span>Brand: {(item as any).brand}</span>}
                  </p>

                  <p className="text-lg font-bold text-gray-900 mt-1">${Number(item.price || 0).toFixed(2)}</p>

                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      className="bg-[#f7f7f7] text-black p-2 border border-gray-200 hover:border-blue-500 rounded-full text-sm hover:bg-white duration-200 cursor-pointer"
                    >
                      <FaMinus />
                    </button>
                    <span className="text-base font-semibold w-10 text-center">{item.quantity || 1}</span>
                    <button
                      onClick={() => handleIncrease(item.id)}
                      className="bg-[#f7f7f7] text-black p-2 border border-gray-200 hover:border-blue-500 rounded-full text-sm hover:bg-white duration-200 cursor-pointer"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: summary */}
      <aside className="w-full md:w-64 border rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <p className="text-sm text-gray-700 mb-1">
          Items{' '}
          <span className="font-medium">
            {totalQuantity} item{totalQuantity === 1 ? '' : 's'}
          </span>
        </p>
        <p className="text-base text-gray-900 mb-4">
          Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
        </p>

        <button
          onClick={handlePlaceOrder}
          disabled={cartProduct.length === 0}
          className="w-full bg-amazonOrange hover:bg-amazonOrangeDark text-black font-semibold py-2 rounded-md disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
        >
          Place your order
        </button>

        <p className="mt-2 text-xs text-gray-500">You will be redirected to the homepage after placing your order.</p>
      </aside>
    </div>
  )
}

export default CartPageClient
