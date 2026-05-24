import type {
  AuditAction,
  AuditEventStatus,
  AuditResourceType,
} from '~/domain/entities/AuditEvent'

export interface AuditEventResponseDTO {
  id: number
  uid: string
  createdAt: Date
  updatedAt: Date | null
  status: AuditEventStatus
  action: AuditAction
  resourceType: AuditResourceType
  resourceUid: string | null
  actorUserId: number | null
  actorLabel: string | null
  requestPayload: unknown | null
  beforeSnapshot: unknown | null
  afterSnapshot: unknown | null
  error: unknown | null
  metadata: unknown | null
}

export interface AuditEventListResponseDTO {
  total: number
  records: AuditEventResponseDTO[]
}
