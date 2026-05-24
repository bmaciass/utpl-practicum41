import {
  date,
  decimal,
  index,
  integer,
  pgTable,
  text,
  varchar,
} from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Institution } from './institution'
import { User } from './user'

export const Program = pgTable(
  'Program',
  {
    ...idColumn,
    name: varchar({ length: 128 }).notNull(),
    uid: varchar({ length: 64 }).unique().notNull(),
    description: text(),
    institutionId: integer()
      .references(() => Institution.id)
      .notNull(),
    responsibleId: integer()
      .references(() => User.id)
      .notNull(),
    startDate: date({ mode: 'date' }),
    endDate: date({ mode: 'date' }),
    estimatedInversion: decimal({ mode: 'number' }),
    ...deletedAtColumn,
    ...byColumns,
    ...timestampColumns,
  },
  (table) => ({
    institutionIdIdx: index('Program_institutionId_idx').on(table.institutionId),
  }),
)

export type ProgramPayload = typeof Program.$inferInsert
export type ProgramRecord = typeof Program.$inferSelect
