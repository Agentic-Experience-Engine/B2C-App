'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const FilterSidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleFilterChange = (key: string, value: string | null) => {
    // Create a mutable copy of the current search parameters
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      // If a value is provided, set the parameter
      params.set(key, value)
    } else {
      // If the value is null, it means we want to remove the filter
      params.delete(key)
    }

    // Navigate to the new URL, triggering a server-side re-render of the page
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="w-full md:w-1/4 p-4 bg-white rounded-md shadow-md">
      <h3 className="text-xl font-bold mb-4">Filters</h3>

      {/* Brand Filter Example */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Brand</h4>
        <button
          onClick={() => handleFilterChange('brand', 'Apple')}
          className="block w-full text-left p-2 rounded hover:bg-gray-200"
        >
          Apple
        </button>
        <button
          onClick={() => handleFilterChange('brand', 'Dell')}
          className="block w-full text-left p-2 rounded hover:bg-gray-200"
        >
          Dell
        </button>
        <button
          onClick={() => handleFilterChange('brand', null)} // Button to clear the brand filter
          className="text-sm text-blue-600 mt-1"
        >
          Clear
        </button>
      </div>

      {/* Price Filter Example */}
      <div>
        <h4 className="font-semibold mb-2">Minimum Price</h4>
        <button
          onClick={() => handleFilterChange('minPrice', '50000')}
          className="block w-full text-left p-2 rounded hover:bg-gray-200"
        >
          ₹50,000+
        </button>
        <button
          onClick={() => handleFilterChange('minPrice', '100000')}
          className="block w-full text-left p-2 rounded hover:bg-gray-200"
        >
          ₹1,00,000+
        </button>
        <button
          onClick={() => handleFilterChange('minPrice', null)} // Button to clear the price filter
          className="text-sm text-blue-600 mt-1"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default FilterSidebar
