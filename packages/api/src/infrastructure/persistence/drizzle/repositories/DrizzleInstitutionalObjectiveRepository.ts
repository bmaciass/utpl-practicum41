import type { Db } from '@sigep/db'
import { InstitutionalEstrategicObjetive as InstitutionalObjectiveTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { type SQL, and, eq, inArray, isNull, like } from 'drizzle-orm'
import { compact, isEmpty, isNil } from 'lodash-es'
import type { InstitutionalObjective } from '~/domain/entities/InstitutionalObjective'
import type {
  FindManyInstitutionalObjectivesOptions,
  IInstitutionalObjectiveRepository,
  InstitutionalObjectiveFilters,
} from '~/domain/repositories/IInstitutionalObjectiveRepository'
import { InstitutionalObjectivePersistenceMapper } from '../mappers/InstitutionalObjectivePersistenceMapper'

export class DrizzleInstitutionalObjectiveRepository
  implements IInstitutionalObjectiveRepository
{
  constructor(private db: Db) {}

  async findById(id: number): Promise<InstitutionalObjective | null> {
    const record =
      await this.db.query.InstitutionalEstrategicObjetive.findFirst({
        where: (fields, ops) => ops.eq(fields.id, id),
      })
    return record
      ? InstitutionalObjectivePersistenceMapper.toDomain(record)
      : null
  }

  async findByIds(ids: number[]): Promise<InstitutionalObjective[]> {
    const records =
      await this.db.query.InstitutionalEstrategicObjetive.findMany({
        where: (fields, operators) => operators.inArray(fields.id, ids),
      })
    return records.map(InstitutionalObjectivePersistenceMapper.toDomain)
  }

  async findByUid(uid: string): Promise<InstitutionalObjective | null> {
    const record =
      await this.db.query.InstitutionalEstrategicObjetive.findFirst({
        where: (fields, ops) => ops.eq(fields.uid, uid),
      })
    return record
      ? InstitutionalObjectivePersistenceMapper.toDomain(record)
      : null
  }

  async findByUidOrThrow(uid: string): Promise<InstitutionalObjective> {
    const objective = await this.findByUid(uid)
    if (!objective) {
      throw NotFoundError.forEntity('InstitutionalObjective', uid)
    }
    return objective
  }

  async findMany(
    options?: FindManyInstitutionalObjectivesOptions,
  ): Promise<InstitutionalObjective[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records =
      await this.db.query.InstitutionalEstrategicObjetive.findMany({
        where: filters.length > 0 ? () => and(...filters) : undefined,
        offset: pagination?.offset,
        limit: pagination?.limit,
        orderBy: (fields, ops) => ops.asc(fields.name),
      })

    return records.map(InstitutionalObjectivePersistenceMapper.toDomain)
  }

  async count(where?: InstitutionalObjectiveFilters): Promise<number> {
    const filters = this.buildFilters(where)

    const records =
      await this.db.query.InstitutionalEstrategicObjetive.findMany({
        where: filters.length > 0 ? () => and(...filters) : undefined,
        columns: { id: true },
      })

    return records.length
  }

  async save(
    objective: InstitutionalObjective,
  ): Promise<InstitutionalObjective> {
    const data =
      InstitutionalObjectivePersistenceMapper.toPersistence(objective)

    if (objective.isNew) {
      const [inserted] = await this.db
        .insert(InstitutionalObjectiveTable)
        .values(data)
        .returning()
      return InstitutionalObjectivePersistenceMapper.toDomain(inserted)
    }
    const [updated] = await this.db
      .update(InstitutionalObjectiveTable)
      .set(data)
      .where(eq(InstitutionalObjectiveTable.uid, objective.uid))
      .returning()
    return InstitutionalObjectivePersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db
      .delete(InstitutionalObjectiveTable)
      .where(eq(InstitutionalObjectiveTable.uid, uid))
  }

  private buildFilters(where?: InstitutionalObjectiveFilters): SQL[] {
    if (!where) return []

    return compact([
      !isNil(where.active)
        ? isNull(InstitutionalObjectiveTable.deletedAt)
        : null,
      where.name
        ? like(InstitutionalObjectiveTable.name, `%${where.name}%`)
        : null,
      where.institutionId
        ? eq(InstitutionalObjectiveTable.institutionId, where.institutionId)
        : null,
      where.id && !isEmpty(where.id)
        ? inArray(InstitutionalObjectiveTable.id, where.id)
        : null,
    ])
  }
}
