// app/cart/page.tsx
import CartPageClient from '@/components/cart/CartPageClient'

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        <CartPageClient />
      </div>
    </main>
  )
}
