import type {
  AuditAction,
  AuditResourceType,
} from '~/domain/entities/AuditEvent'

export interface CreatePendingAuditEventDTO {
  action: AuditAction
  resourceType: AuditResourceType
  resourceUid?: string | null
  actorUserId?: number | null
  actorLabel?: string | null
  requestPayload?: unknown | null
  metadata?: unknown | null
}
