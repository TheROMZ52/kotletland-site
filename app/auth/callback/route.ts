import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { completeLogin } from '@/lib/auth'
import { createSupabase } from '@/lib/supabase/server'

// Landing page of the confirmation e-mail link (PKCE code or token hash).
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const tokenHash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null
  const supabase = await createSupabase()

  let ok = false
  if (code) ok = !(await supabase.auth.exchangeCodeForSession(code)).error
  else if (tokenHash && type) ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error

  if (ok) {
    const { data } = await supabase.auth.getUser()
    if (data.user) await completeLogin(data.user)
    return NextResponse.redirect(new URL('/account', url.origin))
  }
  return NextResponse.redirect(new URL('/login?error=callback', url.origin))
}
