import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  varchar,
} from 'drizzle-orm/pg-core'
import { idColumn, timestampColumns, uidColumn } from '../../helpers/column.helpers'
import { User } from './user'

export const auditEventStatusEnum = pgEnum('AuditEventStatus', [
  'pending',
  'succeeded',
  'failed',
])

export const AuditEvent = pgTable(
  'AuditEvent',
  {
    ...idColumn,
    ...uidColumn,
    status: auditEventStatusEnum().notNull().default('pending'),
    action: varchar({ length: 128 }).notNull(),
    resourceType: varchar({ length: 128 }).notNull(),
    resourceUid: varchar({ length: 64 }),
    actorUserId: integer().references(() => User.id),
    actorLabel: varchar({ length: 255 }),
    requestPayload: jsonb(),
    beforeSnapshot: jsonb(),
    afterSnapshot: jsonb(),
    error: jsonb(),
    metadata: jsonb(),
    ...timestampColumns,
  },
  (table) => ({
    createdAtIdx: index('AuditEvent_createdAt_idx').on(table.createdAt),
    statusIdx: index('AuditEvent_status_idx').on(table.status),
    actorUserIdIdx: index('AuditEvent_actorUserId_idx').on(table.actorUserId),
    resourceIdx: index('AuditEvent_resource_idx').on(
      table.resourceType,
      table.resourceUid,
    ),
    actionIdx: index('AuditEvent_action_idx').on(table.action),
  }),
)

export type AuditEventRecord = typeof AuditEvent.$inferSelect
export type AuditEventPayload = typeof AuditEvent.$inferInsert
