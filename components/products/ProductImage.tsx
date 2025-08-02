// "use client";

// import { Product } from "@/type";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// const ProductImage = ({ product }: { product: Product }) => {
//   const [imgUrl, setImgUrl] = useState("");
//   useEffect(() => {
//     if (product) {
//       setImgUrl(product?.images[0]);
//     }
//   }, [product]);

//   return (
//     <div className="flex flex-start">
//       <div>
//         {product?.images?.map((item, index) => (
//           <Image
//             src={item}
//             alt="productImage"
//             width={200}
//             height={200}
//             priority
//             key={index}
//             className={`w-24 h-24 object-contain cursor-pointer opacity-80 hover:opacity-100 duration-300 border border-gray-200 mb-1 ${
//               imgUrl === item && "border-gray-500 rounded-sm opacity-100"
//             }`}
//             onClick={() => setImgUrl(item)}
//           />
//         ))}
//       </div>
//       <div className="bg-gray-100 rounded-md ml-5 w-full max-h-[550px]">
//         {imgUrl && (
//           <Image
//             src={imgUrl}
//             alt="mainImage"
//             width={500}
//             height={500}
//             priority
//             className="w-full h-full object-contain"
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductImage;

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
