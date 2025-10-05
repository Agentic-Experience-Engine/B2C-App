import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'No query received' }, { status: 400 })
  }
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 10,
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('error fetching results:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
