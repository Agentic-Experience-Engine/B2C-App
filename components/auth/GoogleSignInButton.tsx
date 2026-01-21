'use client'

import { createClient } from '@/lib/supabase/client'
import { FaGoogle } from 'react-icons/fa'

export default function GoogleSignInButton() {
  const handleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/onboarding`,
      },
    })
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
    >
      <FaGoogle className="text-base" />
      Continue with Google
    </button>
  )
}
