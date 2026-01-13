import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Institution } from './institution'

export const institutionalUnit = pgTable('institutionalUnit', {
  ...idColumn,
  name: varchar({ length: 128 }).notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  institutionId: integer().references(() => Institution.id, {
    onDelete: 'restrict',
  }),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})
