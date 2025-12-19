'use client'

import { useEffect } from 'react'
import { store } from '@/lib/store'

const CartHydrator = () => {
  const hydrateCartFromDB = store((s) => s.hydrateCartFromDB)

  useEffect(() => {
    // On first client render, try to restore cart from DB (if logged in)
    hydrateCartFromDB()
  }, [hydrateCartFromDB])

  return null
}

export default CartHydrator
