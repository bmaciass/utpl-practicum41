import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Institution } from './institution'

export const InstitutionalEstrategicObjetive = pgTable(
  'InstitutionalEstrategicObjetive',
  {
    ...idColumn,
    name: varchar({ length: 128 }).notNull(),
    description: text().notNull(),
    uid: varchar({ length: 64 }).unique().notNull(),
    institutionId: integer()
      .references(() => Institution.id)
      .notNull(),
    ...deletedAtColumn,
    ...byColumns,
    ...timestampColumns,
  },
)

export type InstitutionEstrategicObjetivePayload =
  typeof InstitutionalEstrategicObjetive.$inferInsert
export type InstitutionEstrategicObjetiveRecord =
  typeof InstitutionalEstrategicObjetive.$inferSelect
