import * as schema from './schema'
import { Client } from 'pg'

// FIXME: Use node-postgres instead
// See https://github.com/cloudflare/workers-sdk/issues/9668 and https://github.com/brianc/node-postgres/issues/3493

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'

const CONNECTION_TIMEOUT_MS = 5000
const CLOSE_TIMEOUT_MS = 1000

function getDatabaseTarget(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl)

    return {
      database: url.pathname.replace(/^\//, '') || null,
      host: url.hostname || null,
      port: url.port || null,
      scheme: url.protocol.replace(/:$/, '') || null,
      sslmode: url.searchParams.get('sslmode'),
    }
  } catch {
    return {
      database: null,
      host: null,
      port: null,
      scheme: null,
      sslmode: null,
    }
  }
}

function createTimeoutError(action: string, timeoutMs: number) {
  return new Error(`${action} timed out after ${timeoutMs}ms`)
}

async function withTimeout<T>(
  promise: Promise<T>,
  action: string,
  timeoutMs: number,
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(createTimeoutError(action, timeoutMs))
    }, timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

function shouldForceSsl(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl)
    const sslMode = url.searchParams.get('sslmode')
    const ssl = url.searchParams.get('ssl')

    if (sslMode === 'disable' || ssl === 'false') return false
    if (sslMode || ssl) return false

    return url.hostname.endsWith('.supabase.com')
  } catch {
    return false
  }
}

export async function getDBConnection(databaseUrl: string) {
  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
    ssl: shouldForceSsl(databaseUrl) ? true : undefined,
  })

  const db = drizzle({
    client,
    schema,
  })
  return { db, client }
}

export async function connectDBClient(client: Client, databaseUrl: string) {
  const startedAt = Date.now()
  console.log('[db] Connecting to PostgreSQL', {
    ...getDatabaseTarget(databaseUrl),
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
  })

  try {
    const connectPromise = client.connect()
    connectPromise.catch(() => undefined)
    await withTimeout(
      connectPromise,
      'PostgreSQL connection',
      CONNECTION_TIMEOUT_MS,
    )
    console.log('[db] Connected to PostgreSQL', {
      ...getDatabaseTarget(databaseUrl),
      durationMs: Date.now() - startedAt,
    })
  } catch (error) {
    console.error('[db] Failed to connect to PostgreSQL', {
      ...getDatabaseTarget(databaseUrl),
      connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
      durationMs: Date.now() - startedAt,
      error,
    })
    throw error
  }
}

export async function closeDBClient(client: Client, databaseUrl?: string) {
  const startedAt = Date.now()
  console.log('[db] Closing PostgreSQL client', {
    ...(databaseUrl ? getDatabaseTarget(databaseUrl) : {}),
    closeTimeoutMillis: CLOSE_TIMEOUT_MS,
  })

  try {
    const closePromise = client.end()
    closePromise.catch(() => undefined)
    await withTimeout(closePromise, 'PostgreSQL client close', CLOSE_TIMEOUT_MS)
    console.log('[db] Closed PostgreSQL client', {
      ...(databaseUrl ? getDatabaseTarget(databaseUrl) : {}),
      durationMs: Date.now() - startedAt,
    })
  } catch (error) {
    console.error('[db] Failed to close PostgreSQL client', {
      ...(databaseUrl ? getDatabaseTarget(databaseUrl) : {}),
      closeTimeoutMillis: CLOSE_TIMEOUT_MS,
      durationMs: Date.now() - startedAt,
      error,
    })
    throw error
  }
}

export type Db = NodePgDatabase<typeof schema>
export { Client }
