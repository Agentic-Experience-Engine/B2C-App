// lib/auth/getCurrentAppUserId.ts
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

/**
 * Returns the internal User.id for the currently authenticated Supabase user,
 * or null if not logged in OR if we cannot safely reach the database.
 *
 * Use auth.getSession() (SSR-safe) instead of auth.getUser(),
 * which can throw AuthSessionMissingError in server contexts.
 */
export async function getCurrentAppUserId(): Promise<number | null> {
  try {
    const supabase = createClient()

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Supabase getSession error in getCurrentAppUserId:', error)
      return null
    }

    const user = session?.user
    if (!user) {
      return null
    }

    // Map Supabase authId -> internal User.id
    const authLink = await prisma.userAuthentication.findUnique({
      where: { authId: user.id },
    })

    if (!authLink) {
      return null
    }

    return authLink.userId
  } catch (err: any) {
    // IMPORTANT: swallow Prisma pool timeouts so cart APIs don't crash
    if (err?.code === 'P2024') {
      console.error(
        'Prisma P2024 (connection pool timeout) in getCurrentAppUserId – treating as unauthenticated.\nMeta:',
        err?.meta,
      )
      return null
    }

    console.error('Unexpected error in getCurrentAppUserId:', err)
    return null
  }
}
