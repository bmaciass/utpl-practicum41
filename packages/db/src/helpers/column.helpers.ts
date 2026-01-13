import {
  boolean,
  integer,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { User } from '../schema'

export const timestampColumns = {
  updatedAt: timestamp({ withTimezone: false }).$onUpdate(() => new Date()),
  createdAt: timestamp({ withTimezone: false }).defaultNow().notNull(),
}

export const byColumns = {
  createdBy: integer()
    .references(() => User.id)
    .notNull(),
  updatedBy: integer().references(() => User.id),
}

export const idColumn = {
  id: serial().primaryKey(),
}

export const uidColumn = {
  uid: varchar({ length: 64 }).unique().notNull(),
}

export const deletedAtColumn = {
  deletedAt: timestamp({ withTimezone: false }),
}
