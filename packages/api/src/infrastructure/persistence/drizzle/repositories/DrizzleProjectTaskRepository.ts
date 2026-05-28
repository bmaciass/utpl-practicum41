import type { Db } from '@sigep/db'
import {
  Institution as InstitutionTable,
  Program as ProgramTable,
  Project as ProjectTable,
  ProjectTask as ProjectGoalTable,
} from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import {
  type SQL,
  and,
  count,
  eq,
  isNotNull,
  isNull,
  lt,
  notInArray,
} from 'drizzle-orm'
import { compact, isNil } from 'lodash-es'
import type { ProjectTask } from '~/domain/entities/ProjectTask'
import type {
  FindManyProjectTasksOptions,
  IProjectTaskRepository,
  ProjectTaskFilters,
} from '~/domain/repositories/IProjectTaskRepository'
import { ProjectTaskPersistenceMapper } from '../mappers/ProjectTaskPersistenceMapper'

export class DrizzleProjectTaskRepository implements IProjectTaskRepository {
  constructor(private db: Db) {}

  async findById(id: number): Promise<ProjectTask | null> {
    const record = await this.db.query.ProjectTask.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })
    return record ? ProjectTaskPersistenceMapper.toDomain(record) : null
  }

  async findByIds(ids: number[]): Promise<ProjectTask[]> {
    const records = await this.db.query.ProjectTask.findMany({
      where(fields, operators) {
        return operators.inArray(fields.id, ids)
      },
    })

    return records.map(ProjectTaskPersistenceMapper.toDomain)
  }

  async findByUid(uid: string): Promise<ProjectTask | null> {
    const record = await this.db.query.ProjectTask.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })
    return record ? ProjectTaskPersistenceMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<ProjectTask> {
    const goal = await this.findByUid(uid)
    if (!goal) {
      throw NotFoundError.forEntity('ProjectTask', uid)
    }
    return goal
  }

  async findByProjectId(id: number): Promise<ProjectTask[]> {
    const records = await this.db.query.ProjectTask.findMany({
      where(fields, operators) {
        return operators.eq(fields.projectId, id)
      },
    })

    return records.map(ProjectTaskPersistenceMapper.toDomain)
  }

  async findMany(
    options?: FindManyProjectTasksOptions,
  ): Promise<ProjectTask[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records = await this.db.query.ProjectTask.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      offset: pagination?.offset,
      limit: pagination?.limit,
    })

    return records.map(ProjectTaskPersistenceMapper.toDomain)
  }

  async count(where?: ProjectTaskFilters): Promise<number> {
    const filters = this.buildFilters(where)

    const records = await this.db.query.ProjectTask.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      columns: { id: true },
    })

    return records.length
  }

  async countOverdue(options?: {
    referenceDate?: Date
    institutionUid?: string
    programUid?: string
  }): Promise<number> {
    const {
      referenceDate = new Date(),
      institutionUid,
      programUid,
    } = options ?? {}

    const conditions = compact([
      isNull(ProjectGoalTable.deletedAt),
      isNotNull(ProjectGoalTable.endDate),
      lt(ProjectGoalTable.endDate, referenceDate),
      notInArray(ProjectGoalTable.status, ['done', 'cancelled']),
      programUid ? eq(ProgramTable.uid, programUid) : null,
      institutionUid ? eq(InstitutionTable.uid, institutionUid) : null,
    ])

    const [result] = await this.db
      .select({ count: count() })
      .from(ProjectGoalTable)
      .leftJoin(ProjectTable, eq(ProjectGoalTable.projectId, ProjectTable.id))
      .leftJoin(ProgramTable, eq(ProjectTable.programId, ProgramTable.id))
      .leftJoin(
        InstitutionTable,
        eq(ProgramTable.institutionId, InstitutionTable.id),
      )
      .where(and(...conditions))

    return Number(result?.count ?? 0)
  }

  async countByStatus(options?: {
    institutionUid?: string
  }): Promise<Array<{ status: ProjectTask['status']; count: number }>> {
    const { institutionUid } = options ?? {}

    const conditions = compact([
      isNull(ProjectGoalTable.deletedAt),
      institutionUid ? eq(InstitutionTable.uid, institutionUid) : null,
    ])

    const rows = await this.db
      .select({ status: ProjectGoalTable.status, count: count() })
      .from(ProjectGoalTable)
      .leftJoin(ProjectTable, eq(ProjectGoalTable.projectId, ProjectTable.id))
      .leftJoin(ProgramTable, eq(ProjectTable.programId, ProgramTable.id))
      .leftJoin(
        InstitutionTable,
        eq(ProgramTable.institutionId, InstitutionTable.id),
      )
      .where(and(...conditions))
      .groupBy(ProjectGoalTable.status)

    return rows.map((row) => ({ status: row.status, count: Number(row.count) }))
  }

  async save(goal: ProjectTask): Promise<ProjectTask> {
    const data = ProjectTaskPersistenceMapper.toPersistence(goal)

    if (goal.isNew) {
      const [inserted] = await this.db
        .insert(ProjectGoalTable)
        .values(data)
        .returning()
      return ProjectTaskPersistenceMapper.toDomain(inserted)
    }
    const [updated] = await this.db
      .update(ProjectGoalTable)
      .set(data)
      .where(eq(ProjectGoalTable.uid, goal.uid))
      .returning()
    return ProjectTaskPersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db.delete(ProjectGoalTable).where(eq(ProjectGoalTable.uid, uid))
  }

  private buildFilters(where?: ProjectTaskFilters): SQL[] {
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
