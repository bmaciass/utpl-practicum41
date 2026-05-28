import type { Db } from '@sigep/db'
import {
  Institution as InstitutionTable,
  Program as ProgramTable,
  Project as ProjectTable,
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
import type { Project } from '~/domain/entities/Project'
import type {
  FindManyProjectsOptions,
  IProjectRepository,
  ProjectFilters,
} from '~/domain/repositories/IProjectRepository'
import { ProjectPersistenceMapper } from '../mappers/ProjectPersistenceMapper'

export class DrizzleProjectRepository implements IProjectRepository {
  constructor(private db: Db) {}

  async findById(id: number): Promise<Project | null> {
    const record = await this.db.query.Project.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })
    return record ? ProjectPersistenceMapper.toDomain(record) : null
  }

  async findByUid(uid: string): Promise<Project | null> {
    const record = await this.db.query.Project.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })
    return record ? ProjectPersistenceMapper.toDomain(record) : null
  }

  async findByIds(ids: number[]): Promise<Project[]> {
    const records = await this.db.query.Project.findMany({
      where: (fields, operators) => operators.inArray(fields.id, ids),
    })

    return records.map(ProjectPersistenceMapper.toDomain)
  }

  async findByUidOrThrow(uid: string): Promise<Project> {
    const project = await this.findByUid(uid)
    if (!project) {
      throw NotFoundError.forEntity('Project', uid)
    }
    return ProjectPersistenceMapper.toDomain(project)
  }

  async findByProgramId(programId: number): Promise<Project[]> {
    // Query projects with a join to get the program UID
    const records = await this.db
      .select()
      .from(ProjectTable)
      .where(eq(ProgramTable.id, programId))

    return records.map(ProjectPersistenceMapper.toDomain)
  }

  async findMany(options?: FindManyProjectsOptions): Promise<Project[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records = await this.db.query.Project.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      offset: pagination?.offset,
      limit: pagination?.limit,
    })

    return records.map(ProjectPersistenceMapper.toDomain)
  }

  async count(where?: ProjectFilters): Promise<number> {
    const filters = this.buildFilters(where)

    const records = await this.db.query.Project.findMany({
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
      isNull(ProjectTable.deletedAt),
      isNotNull(ProjectTable.endDate),
      lt(ProjectTable.endDate, referenceDate),
      notInArray(ProjectTable.status, ['done', 'cancelled']),
      programUid ? eq(ProgramTable.uid, programUid) : null,
      institutionUid ? eq(InstitutionTable.uid, institutionUid) : null,
    ])

    const [result] = await this.db
      .select({ count: count() })
      .from(ProjectTable)
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
  }): Promise<Array<{ status: Project['status']; count: number }>> {
    const { institutionUid } = options ?? {}

    const conditions = compact([
      isNull(ProjectTable.deletedAt),
      institutionUid ? eq(InstitutionTable.uid, institutionUid) : null,
    ])

    const rows = await this.db
      .select({ status: ProjectTable.status, count: count() })
      .from(ProjectTable)
      .leftJoin(ProgramTable, eq(ProjectTable.programId, ProgramTable.id))
      .leftJoin(
        InstitutionTable,
        eq(ProgramTable.institutionId, InstitutionTable.id),
      )
      .where(and(...conditions))
      .groupBy(ProjectTable.status)

    return rows.map((row) => ({ status: row.status, count: Number(row.count) }))
  }

  async save(project: Project): Promise<Project> {
    const data = ProjectPersistenceMapper.toPersistence(project)

    if (project.isNew) {
      const [inserted] = await this.db
        .insert(ProjectTable)
        .values(data)
        .returning()
      return ProjectPersistenceMapper.toDomain(inserted)
    }
    const [updated] = await this.db
      .update(ProjectTable)
      .set(data)
      .where(eq(ProjectTable.uid, project.uid))
      .returning()
    return ProjectPersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db.delete(ProjectTable).where(eq(ProjectTable.uid, uid))
  }

  private buildFilters(where?: ProjectFilters): SQL[] {
    if (!where) return []

    return compact([
      !isNil(where.active)
        ? where.active
          ? isNull(ProjectTable.deletedAt)
          : isNotNull(ProjectTable.deletedAt)
        : null,
      !isNil(where.programId)
        ? eq(ProjectTable.programId, where.programId)
        : null,
      !isNil(where.responsibleId)
        ? eq(ProjectTable.responsibleId, where.responsibleId)
        : null,
      where.status ? eq(ProjectTable.status, where.status) : null,
    ])
  }
}
