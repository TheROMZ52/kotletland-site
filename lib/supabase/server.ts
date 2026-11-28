import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function supabaseConfig() {
  const url = process.env.NEXVOR_SUPABASE_URL
  const key = process.env.NEXVOR_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) throw new Error('NEXVOR_SUPABASE_URL / NEXVOR_SUPABASE_PUBLISHABLE_KEY are not configured')
  return { url, key }
}

/** Supabase client bound to the request cookies (shared Nexvor accounts). */
export async function createSupabase() {
  const { url, key } = supabaseConfig()
  const store = await cookies()
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options))
        } catch {
          // Called from a Server Component: the proxy refreshes the cookies instead.
        }
      }
    }
  })
}
