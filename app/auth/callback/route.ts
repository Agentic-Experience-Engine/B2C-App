// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/' // default to homepage

  // If there's no code (e.g., someone hits this URL manually), just redirect
  if (!code) {
    return NextResponse.redirect(new URL(next, url.origin))
  }

  const supabase = createClient()

  // Exchange the auth code for a Supabase session (this sets the cookies)
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Error exchanging auth code for session:', error.message)

    // Optional: send them back to login with an error flag
    const loginUrl = new URL('/login', url.origin)
    loginUrl.searchParams.set('error', 'auth')
    return NextResponse.redirect(loginUrl)
  }

  // Success: redirect to whatever `next` was (e.g. /onboarding)
  return NextResponse.redirect(new URL(next, url.origin))
}
