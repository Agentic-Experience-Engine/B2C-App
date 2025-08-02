import { MdMenu } from 'react-icons/md'
import prisma from '../../lib/prisma'
import Link from 'next/link'
import type { Category } from '@prisma/client'
import CategoryLink from './CategoryLink'

const HeaderBottom = async () => {
  let categories: Category[] = []
  try {
    categories = await prisma.category.findMany({
      where: {
        parentId: null,
      },
    })
  } catch (error) {
    console.error('Failed to fetch categories', error)
  }

  return (
    <div className="bg-amazonLight text-white/80">
      <div className="flex items-center space-x-3 py-1 pl-6 text-sm">
        <p className="link flex items-center">
          <MdMenu className="text-xl mr-1" />
          All
        </p>
        {categories.map((category) => (
          <CategoryLink key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

export default HeaderBottom
