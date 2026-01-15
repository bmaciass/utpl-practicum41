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
import { Project } from './project'
import { User } from './user'

export const projectTaskStatusEnum = pgEnum('ProjectGoalStatus', [
  'pending',
  'in_progress',
  'reviewing',
  'done',
  'cancelled',
])

export const ProjectTask = pgTable('ProjectTask', {
  ...idColumn,
  name: varchar({ length: 128 }).notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  description: text(),
  projectId: integer()
    .references(() => Project.id)
    .notNull(),
  status: projectTaskStatusEnum().notNull().default('pending'),
  responsibleId: integer()
    .references(() => User.id)
    .notNull(),
  startDate: date({ mode: 'date' }),
  endDate: date({ mode: 'date' }),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

export type ProjectTaskPayload = typeof ProjectTask.$inferInsert
export type ProjectTaskRecord = typeof ProjectTask.$inferSelect
