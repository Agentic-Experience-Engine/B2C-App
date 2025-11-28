// lib/auth/getCurrentAppUserId.ts
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function getCurrentAppUserId(): Promise<number | null> {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // authId is the PRIMARY KEY in your schema, so this is correct
  const authLink = await prisma.userAuthentication.findUnique({
    where: { authId: user.id },
    select: { userId: true },
  })

  if (!authLink) {
    return null
  }

  return authLink.userId
}
