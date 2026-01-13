import { lexicographicSortSchema, printSchema } from 'graphql'
import { writeFileSync } from 'node:fs'
import schema from '~/presentation/graphql/schema'

const schemaAsString = printSchema(lexicographicSortSchema(schema))

// run from package root
writeFileSync(
  `${__dirname}/../../../../../shared/graphql/api-schema.graphql`,
  schemaAsString,
)
