import type { Db } from '@sigep/db'
import { ObjectiveODS as ObjectiveODSTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import {
  type SQL,
  and,
  count,
  inArray,
  isNotNull,
  isNull,
  like,
} from 'drizzle-orm'
import { compact, isEmpty, isNil } from 'lodash-es'
import type { ObjectiveODS } from '~/domain/entities/ObjectiveODS'
import type {
  FindManyObjectiveODSOptions,
  IObjectiveODSRepository,
  ObjectiveODSFilters,
} from '~/domain/repositories/IObjectiveODSRepository'
import { ObjectiveODSPersistenceMapper } from '../mappers/ObjectiveODSPersistenceMapper'

export class DrizzleObjectiveODSRepository implements IObjectiveODSRepository {
  constructor(private db: Db) {}

  async findById(id: number): Promise<ObjectiveODS | null> {
    const record = await this.db.query.ObjectiveODS.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })
    return record ? ObjectiveODSPersistenceMapper.toDomain(record) : null
  }

  async findByUid(uid: string): Promise<ObjectiveODS | null> {
    const record = await this.db.query.ObjectiveODS.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })
    return record ? ObjectiveODSPersistenceMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<ObjectiveODS> {
    const objectiveODS = await this.findByUid(uid)
    if (!objectiveODS) {
      throw NotFoundError.forEntity('ObjectiveODS', uid)
    }
    return ObjectiveODSPersistenceMapper.toDomain(objectiveODS)
  }

  async findMany(
    options?: FindManyObjectiveODSOptions,
  ): Promise<ObjectiveODS[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records = await this.db.query.ObjectiveODS.findMany({
      where: filters.length > 0 ? () => and(...filters) : undefined,
      offset: pagination?.offset,
      limit: pagination?.limit,
      orderBy: (fields, ops) => ops.asc(fields.name),
    })

    return ObjectiveODSPersistenceMapper.toDomainList(records)
  }

  async count(where?: ObjectiveODSFilters): Promise<number> {
    const filters = this.buildFilters(where)
    const result = await this.db
      .select({ count: count() })
      .from(ObjectiveODSTable)
      .where(filters.length > 0 ? and(...filters) : undefined)

    return result[0]?.count ?? 0
  }

  private buildFilters(where?: ObjectiveODSFilters): SQL[] {
    if (!where) return []

    return compact([
      !isNil(where.active)
        ? where.active
          ? isNull(ObjectiveODSTable.deletedAt)
          : isNotNull(ObjectiveODSTable.deletedAt)
        : null,
      where.name ? like(ObjectiveODSTable.name, `%${where.name}%`) : null,
      where.id && !isEmpty(where.id)
        ? inArray(ObjectiveODSTable.id, where.id)
        : null,
    ])
  }
}
