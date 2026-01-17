import { type Db, Indicator as IndicatorTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { and, eq, ilike, inArray, isNull, or, sql } from 'drizzle-orm'
import type { Indicator } from '~/domain/entities/Indicator'
import type {
  FindManyIndicatorsOptions,
  IIndicatorRepository,
  IndicatorFilters,
} from '~/domain/repositories/IIndicatorRepository'
import { IndicatorPersistenceMapper } from '../mappers/IndicatorPersistenceMapper'

export class DrizzleIndicatorRepository implements IIndicatorRepository {
  constructor(private db: Db) {}

  async findById(id: number): Promise<Indicator | null> {
    const [record] = await this.db
      .select()
      .from(IndicatorTable)
      .where(eq(IndicatorTable.id, id))
      .limit(1)

    return record ? IndicatorPersistenceMapper.toDomain(record) : null
  }

  async findByIds(ids: number[]): Promise<Indicator[]> {
    if (ids.length === 0) {
      return []
    }
    const records = await this.db
      .select()
      .from(IndicatorTable)
      .where(inArray(IndicatorTable.id, ids))

    return records.map(IndicatorPersistenceMapper.toDomain)
  }

  async findByUid(uid: string): Promise<Indicator | null> {
    const [record] = await this.db
      .select()
      .from(IndicatorTable)
      .where(eq(IndicatorTable.uid, uid))
      .limit(1)

    return record ? IndicatorPersistenceMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<Indicator> {
    const indicator = await this.findByUid(uid)

    if (!indicator) {
      throw new NotFoundError('indicator', uid)
    }

    return indicator
  }

  async findByGoalId(goalId: number): Promise<Indicator[]> {
    const records = await this.db
      .select()
      .from(IndicatorTable)
      .where(eq(IndicatorTable.goalId, goalId))

    return records.map(IndicatorPersistenceMapper.toDomain)
  }

  async findByGoalIds(goalIds: number[]): Promise<Indicator[]> {
    if (goalIds.length === 0) {
      return []
    }
    const records = await this.db
      .select()
      .from(IndicatorTable)
      .where(inArray(IndicatorTable.goalId, goalIds))

    return records.map(IndicatorPersistenceMapper.toDomain)
  }

  async findMany(options?: FindManyIndicatorsOptions): Promise<Indicator[]> {
    const conditions = this.buildWhereConditions(options?.where)
    const orderColumn =
      options?.orderBy === 'name'
        ? IndicatorTable.name
        : IndicatorTable.createdAt
    const orderDirection =
      options?.orderDirection === 'desc' ? sql`desc` : sql`asc`

    const records = await this.db
      .select()
      .from(IndicatorTable)
      .where(conditions)
      .orderBy(sql`${orderColumn} ${orderDirection}`)
      .limit(options?.limit ?? 100)
      .offset(options?.offset ?? 0)

    return records.map(IndicatorPersistenceMapper.toDomain)
  }

  async count(where?: IndicatorFilters): Promise<number> {
    const conditions = this.buildWhereConditions(where)

    const [result] = await this.db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(IndicatorTable)
      .where(conditions)

    return result?.count ?? 0
  }

  async save(indicator: Indicator): Promise<Indicator> {
    const data = IndicatorPersistenceMapper.toPersistence(indicator)

    if (indicator.isNew) {
      const [inserted] = await this.db
        .insert(IndicatorTable)
        .values(data)
        .returning()

      return IndicatorPersistenceMapper.toDomain(inserted)
    }

    const [updated] = await this.db
      .update(IndicatorTable)
      .set(data)
      .where(eq(IndicatorTable.id, indicator.id))
      .returning()

    return IndicatorPersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db.delete(IndicatorTable).where(eq(IndicatorTable.uid, uid))
  }

  private buildWhereConditions(filters?: IndicatorFilters) {
    if (!filters) {
      return undefined
    }

    const conditions = []

    if (filters.active !== undefined) {
      conditions.push(
        filters.active
          ? isNull(IndicatorTable.deletedAt)
          : sql`${IndicatorTable.deletedAt} IS NOT NULL`,
      )
    }

    if (filters.goalId) {
      conditions.push(eq(IndicatorTable.goalId, filters.goalId))
    }

    if (filters.type) {
      conditions.push(eq(IndicatorTable.type, filters.type))
    }

    if (filters.search) {
      conditions.push(
        or(
          ilike(IndicatorTable.name, `%${filters.search}%`),
          ilike(IndicatorTable.description, `%${filters.search}%`),
        ),
      )
    }

    return conditions.length > 0 ? and(...conditions) : undefined
  }
}
