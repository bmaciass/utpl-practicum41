import { integer, pgTable } from 'drizzle-orm/pg-core'
import {
  byColumns,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { InstitutionalEstrategicObjetive } from './institutionalEstrategicObjetive'
import { ObjectivePND } from './objectivePND'

export const AlignmentObjectiveStrategicWithPND = pgTable(
  'AlignmentObjectiveStrategicWithPND',
  {
    ...idColumn,
    objectiveStrategicId: integer()
      .references(() => InstitutionalEstrategicObjetive.id)
      .notNull(),
    objectivePNDId: integer()
      .references(() => ObjectivePND.id)
      .notNull(),
    ...byColumns,
    ...timestampColumns,
  },
)
