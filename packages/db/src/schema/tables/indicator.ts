import { integer, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Goal } from './Goal'

export const indicatorType = pgEnum('indicatorType', ['number', 'percentage'])

export const Indicator = pgTable('Indicator', {
  ...idColumn,
  uid: varchar({ length: 64 }).unique().notNull(),
  name: varchar({ length: 128 }).notNull(),
  description: text(),
  type: indicatorType(),
  unitType: varchar(),
  minValue: integer(),
  maxValue: integer(),
  goalId: integer()
    .references(() => Goal.id)
    .notNull(),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

export type IndicatorRecord = typeof Indicator.$inferSelect
export type IndicatorPayload = typeof Indicator.$inferInsert
