import { pgTable, text, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'

export const ObjectiveODS = pgTable('ObjectiveODS', {
  ...idColumn,
  name: varchar({ length: 128 }).notNull(),
  description: text().notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

export type ObjectiveODSRecord = typeof ObjectiveODS.$inferSelect
export type ObjectiveODSPayload = typeof ObjectiveODS.$inferInsert
