import { NextResponse } from 'next/server'
import { produceEvent } from '@/lib/kafka'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message?.orderId) {
      return new NextResponse('Missing orderId', { status: 400 })
    }

    await produceEvent('dev.amazon-clone.orders_consumer', message)
    return new NextResponse('Order event produced', { status: 200 })
  } catch (error) {
    console.error('Error in orders API route:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
