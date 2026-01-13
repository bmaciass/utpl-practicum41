import { integer, pgTable } from 'drizzle-orm/pg-core'
import {
  byColumns,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Role } from './role'
import { User } from './user'

export const UserRole = pgTable('UserRole', {
  ...idColumn,
  ...byColumns,
  ...timestampColumns,
  userId: integer()
    .references(() => User.id)
    .notNull(),
  roleId: integer()
    .references(() => Role.id)
    .notNull(),
})
