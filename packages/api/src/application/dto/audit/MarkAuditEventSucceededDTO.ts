export interface MarkAuditEventSucceededDTO {
  uid: string
  resourceUid?: string | null
  beforeSnapshot?: unknown | null
  afterSnapshot?: unknown | null
  metadata?: unknown | null
}
