import type { Db } from '@sigep/db'
import { ProjectObjective as ProjectObjectiveTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { type SQL, eq, inArray, isNotNull, isNull } from 'drizzle-orm'
import { compact, isNil } from 'lodash-es'
import type { ProjectObjective } from '~/domain/entities/ProjectObjective'
import type {
  FindManyProjectObjectivesOptions,
  IProjectObjectiveRepository,
  ProjectObjectiveFilters,
} from '~/domain/repositories/IProjectObjectiveRepository'
import { ProjectObjectivePersistenceMapper } from '../mappers/ProjectObjectivePersistenceMapper'

export class DrizzleProjectObjectiveRepository
  implements IProjectObjectiveRepository
{
  constructor(private db: Db) {}

  async findById(id: number): Promise<ProjectObjective | null> {
    const record = await this.db.query.ProjectObjective.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })
    return record ? ProjectObjectivePersistenceMapper.toDomain(record) : null
  }

  async findByIds(ids: number[]): Promise<ProjectObjective[]> {
    const records = await this.db.query.ProjectObjective.findMany({
      where(fields, operators) {
        return operators.inArray(fields.id, ids)
      },
    })

    return records.map(ProjectObjectivePersistenceMapper.toDomain)
  }

  async findByUid(uid: string): Promise<ProjectObjective | null> {
    const record = await this.db.query.ProjectObjective.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })
    return record ? ProjectObjectivePersistenceMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<ProjectObjective> {
    const objective = await this.findByUid(uid)
    if (!objective) {
      throw NotFoundError.forEntity('ProjectObjective', uid)
    }
    return objective
  }

  async findByProjectId(id: number): Promise<ProjectObjective[]> {
    const records = await this.db.query.ProjectObjective.findMany({
      where(fields, operators) {
        return operators.eq(fields.projectId, id)
      },
    })

    return records.map(ProjectObjectivePersistenceMapper.toDomain)
  }

  async findMany(
    options?: FindManyProjectObjectivesOptions,
  ): Promise<ProjectObjective[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records = await this.db.query.ProjectObjective.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      offset: pagination?.offset,
      limit: pagination?.limit,
    })

    return records.map(ProjectObjectivePersistenceMapper.toDomain)
  }

  async count(where?: ProjectObjectiveFilters): Promise<number> {
    const filters = this.buildFilters(where)

    const records = await this.db.query.ProjectObjective.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      columns: { id: true },
    })

    return records.length
  }

  async save(objective: ProjectObjective): Promise<ProjectObjective> {
    const data = ProjectObjectivePersistenceMapper.toPersistence(objective)

    if (objective.isNew) {
      const [inserted] = await this.db
        .insert(ProjectObjectiveTable)
        .values(data)
        .returning()
      return ProjectObjectivePersistenceMapper.toDomain(inserted)
    }
    const [updated] = await this.db
      .update(ProjectObjectiveTable)
      .set(data)
      .where(eq(ProjectObjectiveTable.uid, objective.uid))
      .returning()
    return ProjectObjectivePersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db
      .delete(ProjectObjectiveTable)
      .where(eq(ProjectObjectiveTable.uid, uid))
  }

  private buildFilters(where?: ProjectObjectiveFilters): SQL[] {
    if (!where) return []

    return compact([
      !isNil(where.active)
        ? where.active
          ? isNull(ProjectObjectiveTable.deletedAt)
          : isNotNull(ProjectObjectiveTable.deletedAt)
        : null,
      !isNil(where.projectId)
        ? eq(ProjectObjectiveTable.projectId, where.projectId)
        : null,
      where.id && where.id.length > 0
        ? inArray(ProjectObjectiveTable.id, where.id)
        : null,
      where.status ? eq(ProjectObjectiveTable.status, where.status) : null,
    ])
  }
}
