import { integer, pgTable } from 'drizzle-orm/pg-core'
import {
  byColumns,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { ObjectiveODS } from './objectiveODS'
import { ObjectivePND } from './objectivePND'

export const AlignmentObjectivePNDWithODS = pgTable(
  'AlignmentObjectivePNDWithODS',
  {
    ...idColumn,
    objectivePNDId: integer()
      .references(() => ObjectivePND.id)
      .notNull(),
    objectiveODSId: integer()
      .references(() => ObjectiveODS.id)
      .notNull(),
    ...byColumns,
    ...timestampColumns,
  },
)
