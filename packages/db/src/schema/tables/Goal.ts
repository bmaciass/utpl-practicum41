import { date, integer, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { InstitutionalEstrategicObjetive } from './institutionalEstrategicObjetive'

export const goalPeriodEnum = pgEnum('GoalPeriod', ['annual', 'multiannual'])

export const Goal = pgTable('Goal', {
  ...idColumn,
  uid: varchar({ length: 64 }).unique().notNull(),
  name: varchar({ length: 128 }).notNull(),
  description: text().notNull(),
  period: goalPeriodEnum().notNull().default('annual'),
  targetValue: integer(),
  startDate: date({ mode: 'date' }),
  endDate: date({ mode: 'date' }),
  institutionalObjectiveId: integer()
    .references(() => InstitutionalEstrategicObjetive.id)
    .notNull(),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

export type GoalRecord = typeof Goal.$inferSelect
export type GoalPayload = typeof Goal.$inferInsert
