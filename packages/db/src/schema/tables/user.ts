import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'
import {
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Person } from './person'

export const User = pgTable('User', {
  ...idColumn,
  uid: varchar({ length: 64 }).unique().notNull(),
  ...timestampColumns,
  name: varchar({ length: 64 }).unique().notNull(),
  personId: integer()
    .references(() => Person.id)
    .notNull(),
  password: varchar({ length: 512 }).notNull(),
  salt: varchar({ length: 512 }).notNull(),
  ...deletedAtColumn,
  ...timestampColumns,
})

export type UserRecord = typeof User.$inferSelect
export type UserPayload = typeof User.$inferInsert
