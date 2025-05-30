import { Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  return createServerComponentClient<Database>({
    cookies
  })
}
