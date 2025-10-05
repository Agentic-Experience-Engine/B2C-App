// import ProductsList from '@/components/products/ProductsList'
// import { Suspense } from 'react'

// export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
//   const query = searchParams?.q || ''
//   // let products: Product[] = []

//   // try {
//   //   const response = await fetch(`http://localhost:3000/api/search?query=${encodeURIComponent(query)}`)
//   //   if (response.ok) {
//   //     products = await response.json()
//   //   }
//   // } catch (error) {
//   //   console.error('Failed to fetch results: ', error)
//   // }
//   return (
//     <main className="p-4 bg-gray-200">
//       <h1 className="text-2xl font-bold mb-4">
//         Results for: <span className="text-amazonOrange">{query}</span>
//       </h1>

//       {/* We'll use Suspense to show a loading message while the
//         ProductsList component fetches data in the background.
//       */}
//       <Suspense fallback={<p>Loading search results...</p>}>
//         {/* Now we just render the ProductsList component and pass it the
//           search query instead of a categoryId.
//         */}
//         <ProductsList searchQuery={query} />
//       </Suspense>
//     </main>
//   )
// }
