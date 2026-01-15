import type { Db } from '@sigep/db'
import { InstitutionalPlan as InstitutionalPlanTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { type SQL, eq, isNull } from 'drizzle-orm'
import { compact, isNil } from 'lodash-es'
import type { InstitutionalPlan } from '~/domain/entities/InstitutionalPlan'
import type {
  FindManyInstitutionalPlansOptions,
  IInstitutionalPlanRepository,
  InstitutionalPlanFilters,
} from '~/domain/repositories/IInstitutionalPlanRepository'
import { InstitutionalPlanPersistenceMapper } from '../mappers/InstitutionalPlanPersistenceMapper'

export class DrizzleInstitutionalPlanRepository
  implements IInstitutionalPlanRepository
{
  constructor(private db: Db) {}

  async findById(id: number): Promise<InstitutionalPlan | null> {
    const record = await this.db.query.InstitutionalPlan.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })
    return record ? InstitutionalPlanPersistenceMapper.toDomain(record) : null
  }

  async findByUid(uid: string): Promise<InstitutionalPlan | null> {
    const record = await this.db.query.InstitutionalPlan.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })
    return record ? InstitutionalPlanPersistenceMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<InstitutionalPlan> {
    const plan = await this.findByUid(uid)
    if (!plan) {
      throw NotFoundError.forEntity('InstitutionalPlan', uid)
    }
    return plan
  }

  async findMany(
    options?: FindManyInstitutionalPlansOptions,
  ): Promise<InstitutionalPlan[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records = await this.db.query.InstitutionalPlan.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      offset: pagination?.offset,
      limit: pagination?.limit,
    })

    return records.map(InstitutionalPlanPersistenceMapper.toDomain)
  }

  async count(where?: InstitutionalPlanFilters): Promise<number> {
    const filters = this.buildFilters(where)

    const records = await this.db.query.InstitutionalPlan.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      columns: { id: true },
    })

    return records.length
  }

  async save(plan: InstitutionalPlan): Promise<InstitutionalPlan> {
    const data = InstitutionalPlanPersistenceMapper.toPersistence(plan)

    if (plan.isNew) {
      const [inserted] = await this.db
        .insert(InstitutionalPlanTable)
        .values(data)
        .returning()
      return InstitutionalPlanPersistenceMapper.toDomain(inserted)
    }
    const [updated] = await this.db
      .update(InstitutionalPlanTable)
      .set(data)
      .where(eq(InstitutionalPlanTable.uid, plan.uid))
      .returning()
    return InstitutionalPlanPersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db
      .delete(InstitutionalPlanTable)
      .where(eq(InstitutionalPlanTable.uid, uid))
  }

  private buildFilters(where?: InstitutionalPlanFilters): SQL[] {
    if (!where) return []

    return compact([
      !isNil(where.active) ? isNull(InstitutionalPlanTable.deletedAt) : null,
      where.institutionId
        ? eq(InstitutionalPlanTable.institutionId, where.institutionId)
        : null,
      !isNil(where.year) ? eq(InstitutionalPlanTable.year, where.year) : null,
    ])
  }
}
