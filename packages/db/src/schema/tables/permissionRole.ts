import { integer, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Role } from './role'

export const actionPermission = pgEnum('actionPermission', [
  'create',
  'delete',
  'read',
  'update',
  'list',
  'approve',
])

export const effectPermission = pgEnum('effectPermission', ['deny', 'allow'])

export const scopePermission = pgEnum('scopePermission', ['module', 'resource'])

export const PermissionRole = pgTable('PermissionRole', {
  ...idColumn,
  uid: varchar({ length: 64 }).unique().notNull(),
  ...byColumns,
  ...timestampColumns,
  roleId: integer()
    .references(() => Role.id)
    .notNull(),
  action: actionPermission().notNull(),
  effect: effectPermission().notNull(),
  scope: scopePermission().notNull(),
})
