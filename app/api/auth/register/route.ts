import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'
import { isDatabaseUnavailable } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()
    if (!/^[A-Za-z0-9_]{3,16}$/.test(username ?? '')) return NextResponse.json({ error: 'نام کاربری نامعتبر است.' }, { status: 400 })
    if (typeof email !== 'string' || !email.includes('@')) return NextResponse.json({ error: 'ایمیل نامعتبر است.' }, { status: 400 })
    if (typeof password !== 'string' || password.length < 8 || password.length > 72) return NextResponse.json({ error: 'رمز عبور باید بین 8 تا 72 کاراکتر باشد.' }, { status: 400 })
    const result = await registerUser(username, email, password)
    return NextResponse.json({ ok: true, needsConfirmation: result.needsConfirmation })
  } catch (error: any) {
    if (isDatabaseUnavailable(error)) return NextResponse.json({ error: 'در حال حاضر اتصال به دیتابیس برقرار نیست. بعداً دوباره تلاش کن.' }, { status: 503 })
    if (error?.code === 'weak_password' || /password/i.test(String(error?.message ?? ''))) return NextResponse.json({ error: 'این رمز عبور قابل قبول نیست. یک رمز قوی‌تر انتخاب کن.' }, { status: 400 })
    if (error?.code === 'ER_DUP_ENTRY') return NextResponse.json({ error: 'این نام کاربری یا ایمیل قبلاً ثبت شده.' }, { status: 409 })
    return NextResponse.json({ error: 'ساخت اکانت انجام نشد.' }, { status: 500 })
  }
}