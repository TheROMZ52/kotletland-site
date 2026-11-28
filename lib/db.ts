import { Pool, types } from 'pg'

// Keep the MySQL-flavoured behaviour the rest of the code base was written for.
types.setTypeParser(20, (value) => Number(value)) // bigint / count(*)
types.setTypeParser(1700, (value) => Number(value)) // numeric / sum()
types.setTypeParser(16, (value) => (value === 't' ? 1 : 0)) // boolean -> 1 / 0

let pool: Pool | null = null

// Tables with an identity "id" column; INSERTs into them expose insertId like mysql2 did.
const idTables = new Set(['news', 'support_tickets', 'ticket_messages', 'admin_audit_logs', 'notifications', 'store_products', 'store_purchases'])

function getPool() {
  if (pool) return pool
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not configured')
  pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    max: 3,
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 10000
  })
  pool.on('error', () => {})
  return pool
}

/** Converts the small MySQL dialect used by the app into Postgres. */
function translate(sql: string) {
  let text = sql
    .replace(/`/g, '"')
    .replace(/UTC_TIMESTAMP\(\)/gi, 'now()')
    .replace(/INTERVAL\s+(\d+)\s+(SECOND|MINUTE|HOUR|DAY|MONTH)S?\b/gi, (_, amount, unit) => `INTERVAL '${amount} ${String(unit).toLowerCase()}'`)
    .replace(/\bLIKE\b/gi, 'ILIKE')
  let index = 0
  text = text.replace(/\?/g, () => `$${++index}`)
  return text
}

async function run<T = any>(sql: string, params: any[] = []): Promise<[T, any]> {
  let text = translate(sql)
  const insert = /^\s*insert\s+into\s+"?(\w+)"?/i.exec(text)
  const wantsId = Boolean(insert && idTables.has(insert[1].toLowerCase()) && !/\breturning\b/i.test(text))
  if (wantsId) text = text.replace(/;?\s*$/, '') + ' RETURNING id'
  const values = params.map((value) => (value === undefined ? null : value))
  try {
    const result = await getPool().query({ text, values })
    if (/^\s*(select|with)\b/i.test(text)) return [result.rows as any, result.fields]
    return [{ affectedRows: result.rowCount ?? 0, insertId: wantsId ? Number(result.rows[0]?.id ?? 0) : 0 } as any, undefined]
  } catch (error: any) {
    if (error?.code === '23505') error.code = 'ER_DUP_ENTRY'
    throw error
  }
}

export function isDatabaseUnavailable(error: unknown) {
  const code = typeof (error as any)?.code === 'string' ? (error as any).code : ''
  const message = error instanceof Error ? error.message : String(error ?? '')
  return (
    ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN', 'ECONNRESET', '28P01', '28000', '3D000', '57P03', '08006', '08001'].includes(code) ||
    /DATABASE_URL|getaddrinfo|connect|timeout|authentication failed|Tenant or user not found/i.test(message)
  )
}

export const db = {
  execute: run,
  query: run
}
