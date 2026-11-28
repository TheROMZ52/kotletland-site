import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/** Keeps the Supabase session cookies fresh for logged-in visitors. */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXVOR_SUPABASE_URL
  const key = process.env.NEXVOR_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key || !request.cookies.getAll().some((cookie) => cookie.name.startsWith('sb-'))) return NextResponse.next()

  let response = NextResponse.next({ request })
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      }
    }
  })
  try {
    await supabase.auth.getClaims()
  } catch {}
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|logo.png|api/status|api/health|api/minecraft).*)']
}
