'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-md hover:bg-yellow-500"
    >
      Sign Out
    </button>
  )
}
