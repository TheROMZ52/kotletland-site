import { getSiteUrl } from '@/lib/site'

/** Tells the main Nexvor site (and through it the Telegram admin bot) about a ticket event. Never throws. */
export async function notifyMainBot(payload: { event: 'created' | 'reply'; ticketId: number; username: string; subject: string; message: string }) {
  const base = process.env.NEXVOR_MAIN_SITE_URL
  const secret = process.env.NEXVOR_INTEGRATION_SECRET
  if (!base || !secret) return
  try {
    await fetch(`${base.replace(/\/$/, '')}/api/integrations/minecraft/notify`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-integration-secret': secret },
      body: JSON.stringify({ ...payload, adminUrl: `${getSiteUrl()}/admin?ticket=${payload.ticketId}` }),
      signal: AbortSignal.timeout(5000)
    })
  } catch {
    // The bot is a convenience; the ticket is already saved.
  }
}
