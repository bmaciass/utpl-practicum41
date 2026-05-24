import type { AuditEventRecord } from '@sigep/db'
import type { AuditEvent } from '~/domain/entities/AuditEvent'

export class AuditEventPersistenceMapper {
  static toDomain(record: AuditEventRecord): AuditEvent {
    return {
      id: record.id,
      uid: record.uid,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      status: record.status,
      action: record.action,
      resourceType: record.resourceType as AuditEvent['resourceType'],
      resourceUid: record.resourceUid ?? null,
      actorUserId: record.actorUserId ?? null,
      actorLabel: record.actorLabel ?? null,
      requestPayload: record.requestPayload ?? null,
      beforeSnapshot: record.beforeSnapshot ?? null,
      afterSnapshot: record.afterSnapshot ?? null,
      error: record.error ?? null,
      metadata: record.metadata ?? null,
    }
  }
}
