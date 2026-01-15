import { pgTable, text, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'

export const ObjectivePND = pgTable('ObjectivePND', {
  ...idColumn,
  name: varchar({ length: 128 }).notNull(),
  description: text().notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})
