import {
  type AnyPgColumn,
  integer,
  pgTable,
  varchar,
} from 'drizzle-orm/pg-core'
import {
  byColumns,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'

export const institutionalClassification = pgTable(
  'institutionalClassification',
  {
    ...idColumn,
    name: varchar({ length: 128 }).notNull(),
    code: varchar({ length: 64 }).unique().notNull(),
    uid: varchar({ length: 64 }).unique().notNull(),
    parentId: integer().references(
      (): AnyPgColumn => institutionalClassification.id,
      {
        onDelete: 'restrict',
      },
    ),
    ...byColumns,
    ...timestampColumns,
  },
)
