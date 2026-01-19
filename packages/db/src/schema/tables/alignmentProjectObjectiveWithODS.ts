import { integer, pgTable } from 'drizzle-orm/pg-core'
import {
  byColumns,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { ObjectiveODS } from './objectiveODS'
import { ProjectObjective } from './projectObjective'

export const AlignmentProjectObjectiveWithODS = pgTable(
  'AlignmentProjectObjectiveWithODS',
  {
    ...idColumn,
    projectObjectiveId: integer()
      .references(() => ProjectObjective.id)
      .notNull(),
    objectiveODSId: integer()
      .references(() => ObjectiveODS.id)
      .notNull(),
    ...byColumns,
    ...timestampColumns,
  },
)

export type AlignmentProjectObjectiveWithODSRecord =
  typeof AlignmentProjectObjectiveWithODS.$inferSelect
export type AlignmentProjectObjectiveWithODSPayload =
  typeof AlignmentProjectObjectiveWithODS.$inferInsert
