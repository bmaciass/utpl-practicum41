import { integer, pgTable, smallint, text, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Institution } from './institution'

export const InstitutionalPlan = pgTable('InstitutionalPlan', {
  ...idColumn,
  name: varchar({ length: 128 }).notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  description: text().notNull(),
  year: smallint().notNull(),
  url: varchar(),
  institutionId: integer()
    .references(() => Institution.id)
    .notNull(),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

export type InstitutionalPlanPayload = typeof InstitutionalPlan.$inferInsert
export type InstitutionalPlanRecord = typeof InstitutionalPlan.$inferSelect
