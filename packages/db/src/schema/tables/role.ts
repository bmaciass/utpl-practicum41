import { pgTable, varchar } from 'drizzle-orm/pg-core'
import {
  deletedAtColumn,
  byColumns,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'

export const Role = pgTable('Role', {
  ...idColumn,
  uid: varchar({ length: 64 }).unique().notNull(),
  name: varchar().notNull(),

  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

export type RoleRecord = typeof Role.$inferSelect
export type RolePayload = typeof Role.$inferInsert
