export const auditEventStatuses = ['pending', 'succeeded', 'failed'] as const

export type AuditEventStatus = (typeof auditEventStatuses)[number]

export const auditResourceTypes = [
  'user',
  'project',
  'program',
  'goal',
  'indicator',
  'institution',
  'institutional_plan',
  'institutional_objective',
  'objective_pnd',
  'objective_ods',
  'project_objective',
  'project_task',
  'alignment_institutional_pnd',
  'alignment_pnd_ods',
  'alignment_project_objective_ods',
  'auth_session',
] as const

export type AuditResourceType = (typeof auditResourceTypes)[number]

export type AuditAction = string

export interface AuditEvent {
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
