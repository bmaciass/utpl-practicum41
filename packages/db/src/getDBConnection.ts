import * as schema from './schema'
import { Client } from 'pg'

// FIXME: Use node-postgres instead
// See https://github.com/cloudflare/workers-sdk/issues/9668 and https://github.com/brianc/node-postgres/issues/3493

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'

const CONNECTION_TIMEOUT_MS = 5000

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

export async function getDBConnection(databaseUrl: string) {
  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
  })

  const db = drizzle({
    client,
    schema,
  })
  return { db, client }
}

export async function connectDBClient(client: Client, databaseUrl: string) {
  try {
    await client.connect()
  } catch (error) {
    console.error('[db] Failed to connect to PostgreSQL', {
      ...getDatabaseTarget(databaseUrl),
      connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
      error,
    })
    throw error
  }
}

export type Db = NodePgDatabase<typeof schema>
export { Client }
