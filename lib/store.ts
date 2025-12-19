import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/type'

interface StoreType {
  // cart
  cartProduct: Product[]
  addToCart: (product: Product) => Promise<void>
  decreaseQuantity: (productId: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  resetCart: () => void
  hydrateCartFromDB: () => Promise<void>

  // favorite
  favoriteProduct: Product[]
  addToFavorite: (product: Product) => Promise<void>
  removeFromFavorite: (productId: number) => void
  resetFavorite: () => void
}

// Custom storage object (client-side only)
const customStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null
    const item = window.localStorage.getItem(name)
    return item ? JSON.parse(item) : null
  },
  setItem: (name: string, value: any) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(name)
  },
}

export const store = create<StoreType>()(
  persist(
    (set, get) => ({
      cartProduct: [],
      favoriteProduct: [],

      // 🔹 Load cart from DB for logged-in user (Amazon-like restore on login)
      hydrateCartFromDB: async () => {
        try {
          const res = await fetch('/api/cart/load', { cache: 'no-store' })
          if (!res.ok) return
          const data = await res.json()
          if (Array.isArray(data.items)) {
            set({ cartProduct: data.items })
          }
        } catch (err) {
          console.error('Failed to hydrate cart from DB:', err)
        }
      },

      // 🔹 Add or increment a product in cart
      addToCart: async (product: Product) => {
        const current = get().cartProduct
        const existing = current.find((p) => p.id === product.id)
        const listingId = product.listingId

        let newQuantity: number

        if (existing) {
          newQuantity = (existing.quantity ?? 0) + 1
          set({
            cartProduct: current.map((p) => (p.id === product.id ? { ...p, quantity: newQuantity } : p)),
          })
        } else {
          newQuantity = 1
          set({
            cartProduct: [...current, { ...product, quantity: 1 }],
          })
        }

        // Sync to DB if we know the listingId
        if (listingId) {
          try {
            await fetch('/api/cart/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ listingId, quantity: newQuantity }),
            })
          } catch (err) {
            console.error('Failed to sync addToCart:', err)
          }
        }
      },

      // 🔹 Decrease quantity; when it hits 0, remove item
      decreaseQuantity: async (productId: number) => {
        const current = get().cartProduct
        const item = current.find((p) => p.id === productId)
        if (!item) return

        const listingId = item.listingId
        const currentQty = item.quantity ?? 1
        const newQty = currentQty - 1

        if (newQty <= 0) {
          // Remove fully
          set({
            cartProduct: current.filter((p) => p.id !== productId),
          })

          if (listingId) {
            try {
              await fetch('/api/cart/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId, quantity: 0 }),
              })
            } catch (err) {
              console.error('Failed to sync removeFromCart via decrease:', err)
            }
          }

          return
        }

        // Just decrement
        set({
          cartProduct: current.map((p) => (p.id === productId ? { ...p, quantity: newQty } : p)),
        })

        if (listingId) {
          try {
            await fetch('/api/cart/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ listingId, quantity: newQty }),
            })
          } catch (err) {
            console.error('Failed to sync decreaseQuantity:', err)
          }
        }
      },

      // 🔹 Remove product from cart completely
      removeFromCart: async (productId: number) => {
        const current = get().cartProduct
        const item = current.find((p) => p.id === productId)
        if (!item) return
        const listingId = item.listingId

        set({
          cartProduct: current.filter((p) => p.id !== productId),
        })

        if (listingId) {
          try {
            await fetch('/api/cart/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ listingId, quantity: 0 }),
            })
          } catch (err) {
            console.error('Failed to sync removeFromCart:', err)
          }
        }
      },

      // 🔹 Reset cart client-side only (used after order placement; DB already cleared in /orders/place)
      resetCart: () => {
        set({ cartProduct: [] })
      },

      // ===== FAVORITES (unchanged behavior) =====
      addToFavorite: (product: Product) => {
        return new Promise<void>((resolve) => {
          set((state: StoreType) => {
            const isFavorite = state.favoriteProduct.some((item) => item.id === product.id)
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter((item) => item.id !== product.id)
                : [...state.favoriteProduct, { ...product }],
            }
          })
          resolve()
        })
      },

      removeFromFavorite: (productId: number) => {
        set((state: StoreType) => ({
          favoriteProduct: state.favoriteProduct.filter((item) => item.id !== productId),
        }))
      },

      resetFavorite: () => {
        set({ favoriteProduct: [] })
      },
    }),
    {
      name: 'store-storage',
      storage: customStorage,
    },
  ),
)
