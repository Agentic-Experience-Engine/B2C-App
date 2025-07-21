'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { FaGoogle } from 'react-icons/fa'

export default function GoogleSignInButton() {
  const handleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // After Google sign-in, the callback will fire, and then we want the user
        // to land on the onboarding page to complete their profile.
        redirectTo: `${location.origin}/auth/callback?next=/onboarding`,
      },
    })
  }
  // ... rest of the component

  return <Button onClick={handleSignIn}>Sign In with Google</Button>
}
