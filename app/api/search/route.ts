import { NextResponse } from 'next/server'
import { getCurrentAppUserId } from '@/lib/auth/getCurrentAppUserId'

const PAP_AGENTIC_URL = 'http://localhost:8000/api/v1/search'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'No query received' }, { status: 400 })
  }

  let appUserId: number | null = null

  try {
    appUserId = await getCurrentAppUserId()
  } catch (err) {
    console.warn('[api/search] User not authenticated')
  }

  const payload = {
    query,
    userId: appUserId,
    action: 'search',
    metadata: {
      source: 'b2c-web',
      timestamp: new Date().toISOString(),
    },
  }

  console.log('[api/search] Payload being sent to PAP-Agentic:')
  console.log(JSON.stringify(payload, null, 2))

  try {
    const papRes = await fetch(PAP_AGENTIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!papRes.ok) {
      console.error('[api/search] PAP-Agentic error:', papRes.status)
      return NextResponse.json({ error: 'PAP-Agentic failed' }, { status: 502 })
    }

    const papData = await papRes.json()

    console.log('[api/search] Response from PAP-Agentic:')
    console.log(JSON.stringify(papData, null, 2))

    return NextResponse.json(papData)
  } catch (err) {
    console.error('[api/search] Network error calling PAP-Agentic:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
