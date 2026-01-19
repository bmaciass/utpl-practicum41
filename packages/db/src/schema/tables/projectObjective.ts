import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Project } from './project'
import { projectTaskStatusEnum } from './projectTask'

export const ProjectObjective = pgTable('ProjectObjective', {
  ...idColumn,
  uid: varchar({ length: 64 }).unique().notNull(),
  name: varchar({ length: 128 }).notNull(),
  status: projectTaskStatusEnum().notNull().default('pending'),
  projectId: integer()
    .references(() => Project.id)
    .notNull(),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

export type ProjectObjectiveRecord = typeof ProjectObjective.$inferSelect
export type ProjectObjectivePayload = typeof ProjectObjective.$inferInsert
