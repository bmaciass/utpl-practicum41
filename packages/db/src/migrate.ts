import 'dotenv/config'
import { getDBConnection } from './getDBConnection'
import { executeMigration } from './migrator'

function getDirectDatabaseUrl() {
  const directDatabaseUrl = process.env.DIRECT_DATABASE_URL
  if (!directDatabaseUrl) {
    throw new Error('DIRECT_DATABASE_URL is not defined')
  }

  return directDatabaseUrl
}

const directDatabaseUrl = getDirectDatabaseUrl()

console.log(`starting migrations at ${directDatabaseUrl}`)

async function migrate() {
  const { client, db } = await getDBConnection(directDatabaseUrl)
  await client.connect()
  await executeMigration(db)
  await client.end()
}

migrate()
  .then(() => {
    console.log('migration finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
