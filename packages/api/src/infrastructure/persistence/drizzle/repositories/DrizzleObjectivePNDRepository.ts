import type { Db } from '@sigep/db'
import { ObjectivePND as ObjectivePNDTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { type SQL, and, eq, inArray, isNull, like } from 'drizzle-orm'
import { compact, isEmpty, isNil } from 'lodash-es'
import type { ObjectivePND } from '~/domain/entities/ObjectivePND'
import type {
  FindManyObjectivePNDOptions,
  IObjectivePNDRepository,
  ObjectivePNDFilters,
} from '~/domain/repositories/IObjectivePNDRepository'
import { ObjectivePNDPersistenceMapper } from '../mappers/ObjectivePNDPersistenceMapper'

export class DrizzleObjectivePNDRepository implements IObjectivePNDRepository {
  constructor(private db: Db) {}

  async findById(id: number): Promise<ObjectivePND | null> {
    const record = await this.db.query.ObjectivePND.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })
    return record ? ObjectivePNDPersistenceMapper.toDomain(record) : null
  }

  async findByUid(uid: string): Promise<ObjectivePND | null> {
    const record = await this.db.query.ObjectivePND.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })
    return record ? ObjectivePNDPersistenceMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<ObjectivePND> {
    const objective = await this.findByUid(uid)
    if (!objective) {
      throw NotFoundError.forEntity('ObjectivePND', uid)
    }
    return objective
  }

  async findMany(
    options?: FindManyObjectivePNDOptions,
  ): Promise<ObjectivePND[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records = await this.db.query.ObjectivePND.findMany({
      where: filters.length > 0 ? () => and(...filters) : undefined,
      offset: pagination?.offset,
      limit: pagination?.limit,
      orderBy: (fields, ops) => ops.asc(fields.name),
    })

    return records.map(ObjectivePNDPersistenceMapper.toDomain)
  }

  async count(where?: ObjectivePNDFilters): Promise<number> {
    const filters = this.buildFilters(where)

    const records = await this.db.query.ObjectivePND.findMany({
      where: filters.length > 0 ? () => and(...filters) : undefined,
      columns: { id: true },
    })

    return records.length
  }

  async save(objective: ObjectivePND): Promise<ObjectivePND> {
    const data = ObjectivePNDPersistenceMapper.toPersistence(objective)

    if (objective.isNew) {
      const [inserted] = await this.db
        .insert(ObjectivePNDTable)
        .values(data)
        .returning()
      return ObjectivePNDPersistenceMapper.toDomain(inserted)
    }
    const [updated] = await this.db
      .update(ObjectivePNDTable)
      .set(data)
      .where(eq(ObjectivePNDTable.uid, objective.uid))
      .returning()
    return ObjectivePNDPersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db
      .delete(ObjectivePNDTable)
      .where(eq(ObjectivePNDTable.uid, uid))
  }

  private buildFilters(where?: ObjectivePNDFilters): SQL[] {
    if (!where) return []

    return compact([
      !isNil(where.active) ? isNull(ObjectivePNDTable.deletedAt) : null,
      where.name ? like(ObjectivePNDTable.name, `%${where.name}%`) : null,
      where.id && !isEmpty(where.id)
        ? inArray(ObjectivePNDTable.id, where.id)
        : null,
    ])
  }
}
