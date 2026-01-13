import { pgTable, varchar } from 'drizzle-orm/pg-core'
import {
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'

export const Person = pgTable('Person', {
  ...idColumn,
  uid: varchar({ length: 64 }).unique().notNull(),
  firstName: varchar({ length: 64 }).notNull(),
  lastName: varchar({ length: 64 }).notNull(),
  dni: varchar({ length: 15 }).notNull(),
  ...deletedAtColumn,
  ...timestampColumns,
})

export type PersonPayload = typeof Person.$inferInsert
export type PersonRecord = typeof Person.$inferSelect
