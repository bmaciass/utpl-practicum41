import { AuditEvent as AuditEventTable, type Db } from '@sigep/db'
import { and, desc, eq, ilike, sql } from 'drizzle-orm'
import type {
  AuditEventFilters,
  CreatePendingAuditEventInput,
  IAuditEventRepository,
  ListAuditEventsOptions,
  MarkAuditEventFailedInput,
  MarkAuditEventSucceededInput,
} from '~/domain/repositories/IAuditEventRepository'
import { AuditEventPersistenceMapper } from '../mappers/AuditEventPersistenceMapper'

export class DrizzleAuditEventRepository implements IAuditEventRepository {
  constructor(private db: Db) {}

  async createPending(input: CreatePendingAuditEventInput) {
    const [record] = await this.db
      .insert(AuditEventTable)
      .values({
        uid: crypto.randomUUID(),
        status: 'pending',
        action: input.action,
        resourceType: input.resourceType,
        resourceUid: input.resourceUid ?? null,
        actorUserId: input.actorUserId ?? null,
        actorLabel: input.actorLabel ?? null,
        requestPayload: input.requestPayload ?? null,
        metadata: input.metadata ?? null,
      })
      .returning()

    return AuditEventPersistenceMapper.toDomain(record)
  }

  async markSucceeded(input: MarkAuditEventSucceededInput) {
    const [record] = await this.db
      .update(AuditEventTable)
      .set({
        status: 'succeeded',
        resourceUid: input.resourceUid ?? undefined,
        beforeSnapshot: input.beforeSnapshot ?? undefined,
        afterSnapshot: input.afterSnapshot ?? undefined,
        metadata: input.metadata ?? undefined,
      })
      .where(eq(AuditEventTable.uid, input.uid))
      .returning()

    return AuditEventPersistenceMapper.toDomain(record)
  }

  async markFailed(input: MarkAuditEventFailedInput) {
    const [record] = await this.db
      .update(AuditEventTable)
      .set({
        status: 'failed',
        resourceUid: input.resourceUid ?? undefined,
        beforeSnapshot: input.beforeSnapshot ?? undefined,
        error: input.error,
        metadata: input.metadata ?? undefined,
      })
      .where(eq(AuditEventTable.uid, input.uid))
      .returning()

    return AuditEventPersistenceMapper.toDomain(record)
  }

  async findByUid(uid: string) {
    const record = await this.db.query.AuditEvent.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })

    return record ? AuditEventPersistenceMapper.toDomain(record) : null
  }

  async list(options?: ListAuditEventsOptions) {
    const records = await this.db
      .select()
      .from(AuditEventTable)
      .where(this.buildWhereConditions(options?.filters))
      .orderBy(desc(AuditEventTable.createdAt))
      .limit(options?.limit ?? 50)
      .offset(options?.offset ?? 0)

    return records.map(AuditEventPersistenceMapper.toDomain)
  }

  async count(filters?: AuditEventFilters) {
    const [result] = await this.db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(AuditEventTable)
      .where(this.buildWhereConditions(filters))

    return result?.count ?? 0
  }

  private buildWhereConditions(filters?: AuditEventFilters) {
    if (!filters) {
      return undefined
    }

    const conditions = []

    if (filters.status) {
      conditions.push(eq(AuditEventTable.status, filters.status))
    }

    if (filters.action) {
      conditions.push(eq(AuditEventTable.action, filters.action))
    }

    if (filters.resourceType) {
      conditions.push(eq(AuditEventTable.resourceType, filters.resourceType))
    }

    if (filters.resourceUid) {
      conditions.push(eq(AuditEventTable.resourceUid, filters.resourceUid))
    }

    if (filters.actorLabel) {
      conditions.push(
        ilike(AuditEventTable.actorLabel, `%${filters.actorLabel}%`),
      )
    }

    return conditions.length > 0 ? and(...conditions) : undefined
  }
}
