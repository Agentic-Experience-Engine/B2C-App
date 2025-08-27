'use client'
import { useState } from 'react'

type Item = { sku: string; qty: number; price: number }

export default function PlaceOrderButton(props: {
  orderId: string
  userId: string
  items: Item[]
  total: number
}) {
  const { orderId, userId, items, total } = props
  const [loading, setLoading] = useState(false)

  const placeOrder = async () => {
    setLoading(true)
    const body = JSON.stringify({
      message: {
        orderId,
        userId,
        items,            // [{ sku, qty, price }]
        total,            // sum(items)
        status: 'CREATED',
        createdAt: new Date().toISOString(),
      },
    })

    // Prefer sendBeacon so navigation doesn’t cancel the request
    if ('sendBeacon' in navigator) {
      navigator.sendBeacon('/api/orders', new Blob([body], { type: 'application/json' }))
    } else {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      })
    }

    setLoading(false)
    // TODO: navigate to thank-you page / clear cart
  }

  return (
    <button onClick={placeOrder} disabled={loading} className="btn">
      {loading ? 'Placing…' : 'Place order'}
    </button>
  )
}
