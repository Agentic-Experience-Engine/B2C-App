// 1. Mark this as a Client Component because it uses an event handler (onError)
'use client'

import Image from 'next/image'

// Define the props this component needs
interface ProductImageProps {
  src: string | null // The image URL can be null
  alt: string
}

const ProductImage = ({ src, alt }: ProductImageProps) => {
  const placeholderImg = 'https://placehold.co/300x300/e2e8f0/e2e8f0?text=No+Image'

  return (
    <Image
      src={src || placeholderImg} // Use the src if it exists, otherwise the placeholder
      alt={alt}
      layout="fill"
      objectFit="contain"
      className="rounded-t-lg"
      // Now this event handler is inside a Client Component, so it's allowed!
      onError={(e) => {
        e.currentTarget.src = placeholderImg
      }}
    />
  )
}

export default ProductImage
