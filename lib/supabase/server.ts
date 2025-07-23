import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// This function is for use in SERVER COMPONENTS
export const createClient = () => createServerComponentClient({ cookies })
