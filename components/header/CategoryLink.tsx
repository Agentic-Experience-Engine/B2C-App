'use client'
import type { Category } from '@prisma/client'
import Link from 'next/link'

interface CategoryLinkProps {
  category: Category
}

const CategoryLink = ({ category }: CategoryLinkProps) => {
  const handleClick = async () => {
    console.log(`Clicked on category: ${category.name}`)

    const message = {
      eventType: 'category_click',
      categoryId: category.id,
      categoryName: category.name,
      timestamp: new Date().toISOString(),
    }

    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: 'dev.amazon-clone.user-events',
          message: message,
        }),
      })
    } catch (error) {
      console.error('Failed to send event to API route:', error)
    }
  }
  return (
    <Link
      href={{
        pathname: '/',
        query: { category: category.id.toString() },
      }}
      onClick={handleClick}
    >
      <p className="link whitespace-nowrap">{category.name}</p>
    </Link>
  )
}
export default CategoryLink
