import type { User } from '@supabase/supabase-js'
import { db } from '@/lib/db'
import { getSiteUrl } from '@/lib/site'
import { createSupabase } from '@/lib/supabase/server'

export type CurrentUser = {
  id: string
  username: string
  email: string
  email_verified: boolean
  role: 'user' | 'moderator' | 'admin'
  is_banned: boolean
  ban_reason: string | null
  banned_until: string | null
}

const ACCOUNT_COLUMNS = 'id, username, email, email_verified, role, is_banned, ban_reason, banned_until'

function isBanned(user: { is_banned: unknown; banned_until: string | null }) {
  return Boolean(user.is_banned) && (!user.banned_until || new Date(user.banned_until).getTime() > Date.now())
}

function duplicate() {
  const error: any = new Error('DUPLICATE')
  error.code = 'ER_DUP_ENTRY'
  return error
}

function cleanName(raw: string) {
  let name = raw.replace(/[^A-Za-z0-9_]/g, '').slice(0, 16)
  if (name.length < 3) name = ('nxv' + name).slice(0, 16)
  return name
}

/** Creates the Minecraft-site account row for a (shared) Supabase user the first time we see it. */
async function ensureAccount(user: User, preferredName?: string) {
  const email = (user.email ?? '').toLowerCase()
  const verified = Boolean(user.email_confirmed_at)
  const [existing] = await db.execute<any[]>('SELECT id FROM users WHERE id = ? LIMIT 1', [user.id])
  if (existing.length) {
    await db.execute('UPDATE users SET email = ?, email_verified = ? WHERE id = ?', [email, verified, user.id])
    return
  }

  const seed = cleanName(preferredName || String(user.user_metadata?.mc_username ?? '') || email.split('@')[0] || '')
  for (let attempt = 0; attempt < 25; attempt++) {
    const suffix = attempt === 0 ? '' : String(attempt)
    const name = seed.slice(0, 16 - suffix.length) + suffix
    try {
      await db.execute('INSERT INTO users (id, username, email, email_verified) VALUES (?, ?, ?, ?)', [user.id, name, email, verified])
      await db.execute('INSERT INTO profiles (user_id, display_name) VALUES (?, ?)', [user.id, name])
      break
    } catch (error: any) {
      if (error?.code !== 'ER_DUP_ENTRY') throw error
      const [raced] = await db.execute<any[]>('SELECT id FROM users WHERE id = ? LIMIT 1', [user.id])
      if (raced.length) break
      if (attempt === 24) throw error
    }
  }
  if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL.trim().toLowerCase()) {
    await db.execute("UPDATE users SET role = 'admin' WHERE id = ?", [user.id])
  }
}

export async function registerUser(username: string, email: string, password: string) {
  const [taken] = await db.execute<any[]>('SELECT 1 FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1', [username])
  if (taken.length) throw duplicate()

  const supabase = await createSupabase()
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { mc_username: username }, emailRedirectTo: `${getSiteUrl()}/auth/callback` }
  })
  if (error) {
    if (/already|registered|exists/i.test(error.message) || error.code === 'user_already_exists') throw duplicate()
    throw error
  }
  // Supabase hides existing accounts: it answers with a user that has no identities.
  if (!data.user || (data.user.identities && data.user.identities.length === 0)) throw duplicate()

  await ensureAccount(data.user, username)
  return { needsConfirmation: !data.session }
}

export async function loginUser(email: string, password: string) {
  const supabase = await createSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
  if (error || !data.user) {
    if (error?.code === 'email_not_confirmed') throw new Error('EMAIL_NOT_CONFIRMED')
    throw new Error('INVALID_CREDENTIALS')
  }
  await ensureAccount(data.user)
  const [rows] = await db.execute<any[]>('SELECT is_banned, banned_until FROM users WHERE id = ? LIMIT 1', [data.user.id])
  if (rows[0] && isBanned(rows[0])) {
    await supabase.auth.signOut()
    throw new Error('ACCOUNT_BANNED')
  }
}

/** Used by the e-mail confirmation link. */
export async function completeLogin(user: User) {
  await ensureAccount(user)
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createSupabase()
  const { data } = await supabase.auth.getUser()
  const authUser = data.user
  if (!authUser) return null

  let [rows] = await db.execute<any[]>(`SELECT ${ACCOUNT_COLUMNS} FROM users WHERE id = ? LIMIT 1`, [authUser.id])
  if (!rows[0]) {
    await ensureAccount(authUser)
    ;[rows] = await db.execute<any[]>(`SELECT ${ACCOUNT_COLUMNS} FROM users WHERE id = ? LIMIT 1`, [authUser.id])
  }
  const user = rows[0]
  if (!user) return null

  const verified = Boolean(authUser.email_confirmed_at)
  if (Boolean(user.email_verified) !== verified) {
    await db.execute('UPDATE users SET email_verified = ? WHERE id = ?', [verified, authUser.id])
    user.email_verified = verified ? 1 : 0
  }
  if (isBanned(user)) {
    await supabase.auth.signOut()
    return null
  }
  return user
}

export async function logoutUser() {
  const supabase = await createSupabase()
  await supabase.auth.signOut()
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') return null
  return user
}
