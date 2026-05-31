function getDirectDatabaseUrl() {
  const directDatabaseUrl = process.env.DIRECT_DATABASE_URL
  if (!directDatabaseUrl) {
    throw new Error('DIRECT_DATABASE_URL is not defined')
  }

  return directDatabaseUrl
}

export const directDatabaseUrl = getDirectDatabaseUrl()
