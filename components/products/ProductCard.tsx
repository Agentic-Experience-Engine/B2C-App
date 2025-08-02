import { Listing, Product } from '@prisma/client'
import type { ListingWithProduct } from './ProductsList'
// import Image from 'next/image'
import ProductImage from './ProductImage'

interface ProductCardProps {
  listing: ListingWithProduct
}

const ProductCard = ({ listing }: ProductCardProps) => {
  const { product, price } = listing

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col group transition-transform duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1">
      {/* The Image Section */}
      <div className="w-full h-48 relative mb-4">
        {/* Use our new, interactive Client Component here */}
        {/* <ProductImage src={product.imageUrl} alt={product.name} /> */}
        <h1>TEMP_IMG</h1>
      </div>

      {/* The Text Content Section (this all remains the same) */}
      <div className="flex flex-col flex-grow">
        <p className="text-sm text-gray-500 mb-1">{product.brand || 'Brand'}</p>
        <h2
          className="text-md font-semibold text-gray-800 truncate group-hover:text-amazon-blue_light"
          title={product.name}
        >
          {product.name}
        </h2>
        <div className="mt-auto pt-2">
          <p className="text-xl font-bold text-gray-900">${price.toString()}</p>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
