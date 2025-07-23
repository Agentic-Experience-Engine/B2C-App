import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// This function is for use in CLIENT COMPONENTS
export const createClient = () => createClientComponentClient()
