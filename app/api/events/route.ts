import { produceEvent } from '@/lib/kafka'
import { NextResponse } from 'next/server'

// This function handles POST requests to /api/events
export async function POST(request: Request) {
  try {
    // Get the data sent from the client component
    const eventData = await request.json()
    const { topic, message } = eventData

    // Validate that we received the necessary data
    if (!topic || !message) {
      return new NextResponse('Missing topic or message', { status: 400 })
    }

    // Now, we safely call our server-side function
    await produceEvent(topic, message)

    // Send a success response back to the client
    return new NextResponse('Event produced successfully', { status: 200 })
  } catch (error) {
    console.error('Error in event API route:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
