import FilterSidebar from '@/components/products/FilterSidebar'
import ProductsList from '@/components/products/ProductsList'
import { Suspense } from 'react'

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : ''
  const brand = typeof searchParams?.brand === 'string' ? searchParams.brand : undefined
  const minPrice = typeof searchParams?.minPrice === 'string' ? searchParams.minPrice : undefined

  return (
    <main className="p-4 bg-gray-200">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Results for: <span className="text-amazonOrange">{query || 'All Products'}</span>
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <FilterSidebar />
          <Suspense key={JSON.stringify(searchParams)} fallback={<p>Loading search results...</p>}>
            <ProductsList searchQuery={query} brand={brand} minPrice={minPrice} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
