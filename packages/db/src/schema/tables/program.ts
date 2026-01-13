import { date, integer, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { User } from './user'

export const Program = pgTable('Program', {
  ...idColumn,
  name: varchar({ length: 128 }).notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  description: text(),
  responsibleId: integer()
    .references(() => User.id)
    .notNull(),
  startDate: date({ mode: 'date' }),
  endDate: date({ mode: 'date' }),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

export type ProgramPayload = typeof Program.$inferInsert
export type ProgramRecord = typeof Program.$inferSelect
