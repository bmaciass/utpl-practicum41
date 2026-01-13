import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  varchar,
} from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Program } from './program'
import { User } from './user'

export const projectStatusEnum = pgEnum('ProjectStatus', [
  'pending',
  'in_progress',
  'done',
  'cancelled',
])

export const Project = pgTable('Project', {
  ...idColumn,
  name: varchar({ length: 128 }).notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  description: text(),
  status: projectStatusEnum().notNull().default('pending'),
  startDate: date({ mode: 'date' }),
  endDate: date({ mode: 'date' }),
  responsibleId: integer()
    .references(() => User.id)
    .notNull(),
  programId: integer()
    .references(() => Program.id)
    .notNull(),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

export type ProjectPayload = typeof Project.$inferInsert
export type ProjectRecord = typeof Project.$inferSelect
