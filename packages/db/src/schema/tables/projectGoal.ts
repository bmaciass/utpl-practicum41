import { date, integer, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Project } from './project'

export const projectGoalStatusEnum = pgEnum('ProjectGoalStatus', [
  'pending',
  'in_progress',
  'reviewing',
  'done',
  'cancelled',
])

export const ProjectGoal = pgTable('ProjectGoal', {
  ...idColumn,
  name: varchar({ length: 128 }).notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  projectId: integer()
    .references(() => Project.id)
    .notNull(),
  status: projectGoalStatusEnum().notNull().default('pending'),
  startDate: date({ mode: 'date' }),
  endDate: date({ mode: 'date' }),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

export type ProjectGoalPayload = typeof ProjectGoal.$inferInsert
export type ProjectGoalRecord = typeof ProjectGoal.$inferSelect
