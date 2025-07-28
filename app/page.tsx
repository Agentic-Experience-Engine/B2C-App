import ProductsList from '@/components/products/ProductsList'

interface HomepageProps {
  searchParams: {
    category?: string
  }
}

const Homepage = async ({ searchParams }: HomepageProps) => {
  return (
    <main className="p-4 bg-gray-200">
      <ProductsList categoryId={searchParams.category} />
    </main>
  )
}
export default Homepage
