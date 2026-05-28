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
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lte,
  sql,
} from 'drizzle-orm'
import { compact, isNil } from 'lodash-es'
import type { Program } from '~/domain/entities/Program'
import type {
  FindManyProgramsOptions,
  IProgramRepository,
  ProgramFilters,
} from '~/domain/repositories/IProgramRepository'
import { ProgramPersistenceMapper } from '../mappers/ProgramPersistenceMapper'

export class DrizzleProgramRepository implements IProgramRepository {
  constructor(private db: Db) {}

  async findById(id: number): Promise<Program | null> {
    const record = await this.db.query.Program.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })
    return record ? ProgramPersistenceMapper.toDomain(record) : null
  }

  async findByIds(ids: number[]): Promise<Program[]> {
    const records = await this.db.query.Program.findMany({
      where: (fields, operators) => operators.inArray(fields.id, ids),
    })

    return records.map(ProgramPersistenceMapper.toDomain)
  }

  async findByUid(uid: string): Promise<Program | null> {
    const record = await this.db.query.Program.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })
    return record ? ProgramPersistenceMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<Program> {
    const program = await this.findByUid(uid)
    if (!program) {
      throw NotFoundError.forEntity('Program', uid)
    }
    return program
  }

  async findMany(options?: FindManyProgramsOptions): Promise<Program[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records = await this.db.query.Program.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      offset: pagination?.offset,
      limit: pagination?.limit,
    })

    return records.map(ProgramPersistenceMapper.toDomain)
  }

  async count(where?: ProgramFilters): Promise<number> {
    const filters = this.buildFilters(where)

    const records = await this.db.query.Program.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      columns: { id: true },
    })

    return records.length
  }

  async countNearingEndDate(options?: {
    fromDate?: Date
    toDate?: Date
    institutionUid?: string
  }): Promise<number> {
    const today = new Date()
    const thirtyDaysLater = new Date(today)
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)

    const {
      fromDate = today,
      toDate = thirtyDaysLater,
      institutionUid,
    } = options ?? {}

    const conditions = compact([
      isNull(ProgramTable.deletedAt),
      isNotNull(ProgramTable.endDate),
      gte(ProgramTable.endDate, fromDate),
      lte(ProgramTable.endDate, toDate),
      institutionUid ? eq(InstitutionTable.uid, institutionUid) : null,
    ])

    const [result] = await this.db
      .select({ count: sql<number>`count(distinct ${ProgramTable.id})` })
      .from(ProgramTable)
      .leftJoin(
        InstitutionTable,
        eq(ProgramTable.institutionId, InstitutionTable.id),
      )
      .innerJoin(
        ProjectTable,
        and(
          eq(ProjectTable.programId, ProgramTable.id),
          isNull(ProjectTable.deletedAt),
          inArray(ProjectTable.status, ['pending', 'in_progress']),
        ),
      )
      .where(and(...conditions))

    return Number(result?.count ?? 0)
  }

  async save(program: Program): Promise<Program> {
    const data = ProgramPersistenceMapper.toPersistence(program)

    if (program.isNew) {
      const [inserted] = await this.db
        .insert(ProgramTable)
        .values(data)
        .returning()
      return ProgramPersistenceMapper.toDomain(inserted)
    }
    const [updated] = await this.db
      .update(ProgramTable)
      .set(data)
      .where(eq(ProgramTable.uid, program.uid))
      .returning()
    return ProgramPersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db.delete(ProgramTable).where(eq(ProgramTable.uid, uid))
  }

  private buildFilters(where?: ProgramFilters): SQL[] {
    if (!where) return []

    return compact([
      !isNil(where.active)
        ? where.active
          ? isNull(ProgramTable.deletedAt)
          : isNotNull(ProgramTable.deletedAt)
        : null,
      where.name?.contains
        ? ilike(ProgramTable.name, `%${where.name.contains}%`)
        : null,
      where.name?.equals ? eq(ProgramTable.name, where.name.equals) : null,
      !isNil(where.institutionId)
        ? eq(ProgramTable.institutionId, where.institutionId)
        : null,
    ])
  }
}
