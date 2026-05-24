import type {
  AuditAction,
  AuditEvent,
  AuditEventStatus,
  AuditResourceType,
} from '../entities/AuditEvent'

export interface AuditEventFilters {
  status?: AuditEventStatus
  action?: AuditAction
  resourceType?: AuditResourceType
  resourceUid?: string
  actorLabel?: string
}

export interface ListAuditEventsOptions {
  filters?: AuditEventFilters
  limit?: number
  offset?: number
}

export interface CreatePendingAuditEventInput {
  action: AuditAction
  resourceType: AuditResourceType
  resourceUid?: string | null
  actorUserId?: number | null
  actorLabel?: string | null
  requestPayload?: unknown | null
  metadata?: unknown | null
}

export interface MarkAuditEventSucceededInput {
  uid: string
  resourceUid?: string | null
  beforeSnapshot?: unknown | null
  afterSnapshot?: unknown | null
  metadata?: unknown | null
}

export interface MarkAuditEventFailedInput {
  uid: string
  resourceUid?: string | null
  beforeSnapshot?: unknown | null
  error: unknown
  metadata?: unknown | null
}

export interface IAuditEventRepository {
  createPending(input: CreatePendingAuditEventInput): Promise<AuditEvent>
  markSucceeded(input: MarkAuditEventSucceededInput): Promise<AuditEvent>
  markFailed(input: MarkAuditEventFailedInput): Promise<AuditEvent>
  findByUid(uid: string): Promise<AuditEvent | null>
  list(options?: ListAuditEventsOptions): Promise<AuditEvent[]>
  count(filters?: AuditEventFilters): Promise<number>
}
