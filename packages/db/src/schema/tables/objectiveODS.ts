import { pgTable, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'

export const ObjectiveODS = pgTable('ObjectiveODS', {
  ...idColumn,
  name: varchar({ length: 128 }).notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  ...byColumns,
  ...timestampColumns,
})
