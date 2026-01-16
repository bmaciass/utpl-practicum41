import { type Db, Goal as GoalTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { and, eq, ilike, isNull, or, sql } from 'drizzle-orm'
import type { Goal } from '~/domain/entities/Goal'
import type {
  FindManyGoalsOptions,
  GoalFilters,
  IGoalRepository,
} from '~/domain/repositories/IGoalRepository'
import { GoalMapper } from '../mappers/GoalMapper'

export class GoalRepository implements IGoalRepository {
  constructor(private db: Db) {}

  async findById(id: number): Promise<Goal | null> {
    const [record] = await this.db
      .select()
      .from(GoalTable)
      .where(eq(GoalTable.id, id))
      .limit(1)

    return record ? GoalMapper.toDomain(record) : null
  }

  async findByUid(uid: string): Promise<Goal | null> {
    const [record] = await this.db
      .select()
      .from(GoalTable)
      .where(eq(GoalTable.uid, uid))
      .limit(1)

    return record ? GoalMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<Goal> {
    const goal = await this.findByUid(uid)

    if (!goal) {
      throw new NotFoundError('goal', uid)
    }

    return goal
  }

  async findMany(options?: FindManyGoalsOptions): Promise<Goal[]> {
    const conditions = this.buildWhereConditions(options?.where)
    const orderColumn =
      options?.orderBy === 'name' ? GoalTable.name : GoalTable.createdAt
    const orderDirection =
      options?.orderDirection === 'desc' ? sql`desc` : sql`asc`

    const records = await this.db
      .select()
      .from(GoalTable)
      .where(conditions)
      .orderBy(sql`${orderColumn} ${orderDirection}`)
      .limit(options?.limit ?? 100)
      .offset(options?.offset ?? 0)

    return records.map(GoalMapper.toDomain)
  }

  async count(where?: GoalFilters): Promise<number> {
    const conditions = this.buildWhereConditions(where)

    const [result] = await this.db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(GoalTable)
      .where(conditions)

    return result?.count ?? 0
  }

  async save(goal: Goal): Promise<Goal> {
    const data = GoalMapper.toPersistence(goal)

    if (goal.id === 0) {
      // Insert
      const [inserted] = await this.db
        .insert(GoalTable)
        .values(data)
        .returning()

      return GoalMapper.toDomain(inserted)
    }
    // Update
    const [updated] = await this.db
      .update(GoalTable)
      .set(data)
      .where(eq(GoalTable.id, goal.id))
      .returning()

    return GoalMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db.delete(GoalTable).where(eq(GoalTable.uid, uid))
  }

  private buildWhereConditions(filters?: GoalFilters) {
    if (!filters) {
      return undefined
    }

    const conditions = []

    if (filters.active !== undefined) {
      conditions.push(
        filters.active
          ? isNull(GoalTable.deletedAt)
          : sql`${GoalTable.deletedAt} IS NOT NULL`,
      )
    }

    if (filters.institutionalObjectiveId) {
      conditions.push(
        eq(
          GoalTable.institutionalObjectiveId,
          filters.institutionalObjectiveId,
        ),
      )
    }

    if (filters.search) {
      conditions.push(
        or(
          ilike(GoalTable.name, `%${filters.search}%`),
          ilike(GoalTable.description, `%${filters.search}%`),
        ),
      )
    }

    return conditions.length > 0 ? and(...conditions) : undefined
  }
}
