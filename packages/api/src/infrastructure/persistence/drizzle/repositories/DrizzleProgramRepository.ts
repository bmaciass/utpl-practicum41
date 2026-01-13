import type { Db } from '@sigep/db'
import { Program as ProgramTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { type SQL, eq, isNotNull, isNull, like } from 'drizzle-orm'
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
      where.name ? like(ProgramTable.name, `%${where.name}%`) : null,
    ])
  }
}
