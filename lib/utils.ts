// lib/util.ts

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { store } from './store' // Make sure this path is correct relative to the new file location

// General utility for combining Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Application-specific utility for cart calculations
export const calculateCartTotals = () => {
  const { cartProduct } = store()
  const totalAmt = cartProduct.reduce(
    (sum, product) => {
      sum.regular += product?.price * product?.quantity!
      sum.discounted += product?.price * (product?.discountPercentage / 100) * product?.quantity!
      return sum
    },
    { regular: 0, discounted: 0 },
  )

  return { totalAmt }
}
