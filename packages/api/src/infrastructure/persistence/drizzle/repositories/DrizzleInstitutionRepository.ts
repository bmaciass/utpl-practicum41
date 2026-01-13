import type { Db } from '@sigep/db'
import { Institution as InstitutionTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { type SQL, eq, ilike, isNotNull, isNull } from 'drizzle-orm'
import { compact, isNil } from 'lodash-es'
import { Institution } from '~/domain/entities/Institution'
import type {
  FindManyInstitutionsOptions,
  IInstitutionRepository,
  InstitutionFilters,
} from '~/domain/repositories/IInstitutionRepository'
import { InstitutionPersistenceMapper } from '../mappers/InstitutionPersistenceMapper'

export class DrizzleInstitutionRepository implements IInstitutionRepository {
  constructor(private db: Db) {}

  async findByIds(ids: number[]): Promise<Institution[]> {
    const records = await this.db.query.Institution.findMany({
      where: (fields, ops) => ops.inArray(fields.id, ids),
    })
    return records.map((record) => Institution.reconstitute(record))
  }

  async findById(id: number): Promise<Institution | null> {
    const record = await this.db.query.Institution.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })
    return record ? InstitutionPersistenceMapper.toDomain(record) : null
  }

  async findByUid(uid: string): Promise<Institution | null> {
    const record = await this.db.query.Institution.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })
    return record ? InstitutionPersistenceMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<Institution> {
    const institution = await this.findByUid(uid)
    if (!institution) {
      throw NotFoundError.forEntity('Institution', uid)
    }
    return InstitutionPersistenceMapper.toDomain(institution)
  }

  async findMany(
    options?: FindManyInstitutionsOptions,
  ): Promise<Institution[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records = await this.db.query.Institution.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      offset: pagination?.offset,
      limit: pagination?.limit,
    })

    return records.map(InstitutionPersistenceMapper.toDomain)
  }

  async count(where?: InstitutionFilters): Promise<number> {
    const filters = this.buildFilters(where)

    const records = await this.db.query.Institution.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      columns: { id: true },
    })

    return records.length
  }

  async save(institution: Institution): Promise<Institution> {
    const data = InstitutionPersistenceMapper.toPersistence(institution)

    if (institution.isNew) {
      const [inserted] = await this.db
        .insert(InstitutionTable)
        .values(data)
        .returning()
      return InstitutionPersistenceMapper.toDomain(inserted)
    }
    const [updated] = await this.db
      .update(InstitutionTable)
      .set(data)
      .where(eq(InstitutionTable.uid, institution.uid))
      .returning()
    return InstitutionPersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db.delete(InstitutionTable).where(eq(InstitutionTable.uid, uid))
  }

  async findByName(name: string): Promise<Institution | null> {
    const record = await this.db.query.Institution.findFirst({
      where: (fields, ops) => ops.eq(fields.name, name),
    })
    return record ? InstitutionPersistenceMapper.toDomain(record) : null
  }

  async existsByName(name: string): Promise<boolean> {
    const record = await this.db.query.Institution.findFirst({
      where: (fields, ops) => ops.eq(fields.name, name),
      columns: { id: true },
    })
    return !!record
  }

  private buildFilters(where?: InstitutionFilters): SQL[] {
    if (!where) return []

    return compact([
      !isNil(where.active)
        ? where.active
          ? isNull(InstitutionTable.deletedAt)
          : isNotNull(InstitutionTable.deletedAt)
        : null,
      where.name?.contains
        ? ilike(InstitutionTable.name, `%${where.name.contains}%`)
        : null,
      where.name?.equals ? eq(InstitutionTable.name, where.name.equals) : null,
    ])
  }
}
