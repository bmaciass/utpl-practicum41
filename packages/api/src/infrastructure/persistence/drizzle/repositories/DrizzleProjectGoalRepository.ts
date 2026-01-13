import type { Db } from '@sigep/db'
import { ProjectGoal as ProjectGoalTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { type SQL, eq, isNotNull, isNull } from 'drizzle-orm'
import { compact, isNil } from 'lodash-es'
import type { ProjectGoal } from '~/domain/entities/ProjectGoal'
import type {
  FindManyProjectGoalsOptions,
  IProjectGoalRepository,
  ProjectGoalFilters,
} from '~/domain/repositories/IProjectGoalRepository'
import { ProjectGoalPersistenceMapper } from '../mappers/ProjectGoalPersistenceMapper'

export class DrizzleProjectGoalRepository implements IProjectGoalRepository {
  constructor(private db: Db) {}

  async findById(id: number): Promise<ProjectGoal | null> {
    const record = await this.db.query.ProjectGoal.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })
    return record ? ProjectGoalPersistenceMapper.toDomain(record) : null
  }

  async findByIds(ids: number[]): Promise<ProjectGoal[]> {
    const records = await this.db.query.ProjectGoal.findMany({
      where(fields, operators) {
        return operators.inArray(fields.id, ids)
      },
    })

    return records.map(ProjectGoalPersistenceMapper.toDomain)
  }

  async findByUid(uid: string): Promise<ProjectGoal | null> {
    const record = await this.db.query.ProjectGoal.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })
    return record ? ProjectGoalPersistenceMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<ProjectGoal> {
    const goal = await this.findByUid(uid)
    if (!goal) {
      throw NotFoundError.forEntity('ProjectGoal', uid)
    }
    return goal
  }

  async findByProjectId(id: number): Promise<ProjectGoal[]> {
    const records = await this.db.query.ProjectGoal.findMany({
      where(fields, operators) {
        return operators.eq(fields.projectId, id)
      },
    })

    return records.map(ProjectGoalPersistenceMapper.toDomain)
  }

  async findMany(
    options?: FindManyProjectGoalsOptions,
  ): Promise<ProjectGoal[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records = await this.db.query.ProjectGoal.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      offset: pagination?.offset,
      limit: pagination?.limit,
    })

    return records.map(ProjectGoalPersistenceMapper.toDomain)
  }

  async count(where?: ProjectGoalFilters): Promise<number> {
    const filters = this.buildFilters(where)

    const records = await this.db.query.ProjectGoal.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      columns: { id: true },
    })

    return records.length
  }

  async save(goal: ProjectGoal): Promise<ProjectGoal> {
    const data = ProjectGoalPersistenceMapper.toPersistence(goal)

    if (goal.isNew) {
      const [inserted] = await this.db
        .insert(ProjectGoalTable)
        .values(data)
        .returning()
      return ProjectGoalPersistenceMapper.toDomain(inserted)
    }
    const [updated] = await this.db
      .update(ProjectGoalTable)
      .set(data)
      .where(eq(ProjectGoalTable.uid, goal.uid))
      .returning()
    return ProjectGoalPersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db.delete(ProjectGoalTable).where(eq(ProjectGoalTable.uid, uid))
  }

  private buildFilters(where?: ProjectGoalFilters): SQL[] {
    if (!where) return []

    return compact([
      !isNil(where.active)
        ? where.active
          ? isNull(ProjectGoalTable.deletedAt)
          : isNotNull(ProjectGoalTable.deletedAt)
        : null,
      !isNil(where.projectId)
        ? eq(ProjectGoalTable.projectId, where.projectId)
        : null,
      where.status ? eq(ProjectGoalTable.status, where.status) : null,
    ])
  }
}
