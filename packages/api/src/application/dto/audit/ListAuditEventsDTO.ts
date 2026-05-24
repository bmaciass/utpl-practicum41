import type {
  AuditAction,
  AuditEventStatus,
  AuditResourceType,
} from '~/domain/entities/AuditEvent'

export interface ListAuditEventsDTO {
  filters?: {
    status?: AuditEventStatus
    action?: AuditAction
    resourceType?: AuditResourceType
    resourceUid?: string
    actorLabel?: string
  }
  limit?: number
  offset?: number
}
