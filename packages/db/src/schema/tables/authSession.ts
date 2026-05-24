import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { idColumn, timestampColumns, uidColumn } from '../../helpers/column.helpers'
import { User } from './user'

export const AuthSession = pgTable('AuthSession', {
  ...idColumn,
  ...uidColumn,
  userId: integer()
    .references(() => User.id)
    .notNull(),
  tokenHash: varchar({ length: 128 }).notNull(),
  expiresAt: timestamp({ withTimezone: false }).notNull(),
  idleExpiresAt: timestamp({ withTimezone: false }).notNull(),
  lastUsedAt: timestamp({ withTimezone: false }).notNull(),
  revokedAt: timestamp({ withTimezone: false }),
  ...timestampColumns,
})

export type AuthSessionRecord = typeof AuthSession.$inferSelect
export type AuthSessionPayload = typeof AuthSession.$inferInsert
