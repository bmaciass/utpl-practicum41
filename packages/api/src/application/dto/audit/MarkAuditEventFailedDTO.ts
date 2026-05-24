export interface MarkAuditEventFailedDTO {
  uid: string
  resourceUid?: string | null
  beforeSnapshot?: unknown | null
  error: unknown
  metadata?: unknown | null
}
