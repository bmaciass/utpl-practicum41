import { and, eq, type SQL } from 'drizzle-orm'
import type { Db } from '@sigep/db'
import { AlignmentProjectObjectiveWithODS } from '@sigep/db'
import type { AlignmentProjectObjectiveToODS } from '~/domain/entities/AlignmentProjectObjectiveToODS'
import type {
  AlignmentProjectObjectiveToODSFilters,
  IAlignmentProjectObjectiveToODSRepository,
} from '~/domain/repositories/IAlignmentProjectObjectiveToODSRepository'
import { AlignmentProjectObjectiveToODSPersistenceMapper } from '../mappers/AlignmentProjectObjectiveToODSPersistenceMapper'

export class DrizzleAlignmentProjectObjectiveToODSRepository
  implements IAlignmentProjectObjectiveToODSRepository
{
  constructor(private db: Db) {}

  async findById(id: number): Promise<AlignmentProjectObjectiveToODS | null> {
    const record =
      await this.db.query.AlignmentProjectObjectiveWithODS.findFirst({
        where: (fields, { eq }) => eq(fields.id, id),
      })
    return record
      ? AlignmentProjectObjectiveToODSPersistenceMapper.toDomain(record)
      : null
  }

  async findMany(
    filters?: AlignmentProjectObjectiveToODSFilters,
  ): Promise<AlignmentProjectObjectiveToODS[]> {
    const conditions: SQL[] = []

    if (filters?.projectObjectiveId) {
      conditions.push(
        eq(
          AlignmentProjectObjectiveWithODS.projectObjectiveId,
          filters.projectObjectiveId,
        ),
      )
    }
    if (filters?.odsObjectiveId) {
      conditions.push(
        eq(
          AlignmentProjectObjectiveWithODS.objectiveODSId,
          filters.odsObjectiveId,
        ),
      )
    }

    const records =
      await this.db.query.AlignmentProjectObjectiveWithODS.findMany({
        where: conditions.length > 0 ? () => and(...conditions) : undefined,
      })

    return AlignmentProjectObjectiveToODSPersistenceMapper.toDomainList(records)
  }

  async findByProjectObjectiveId(
    objectiveId: number,
  ): Promise<AlignmentProjectObjectiveToODS[]> {
    return this.findMany({ projectObjectiveId: objectiveId })
  }

  async findByODSObjectiveId(
    objectiveId: number,
  ): Promise<AlignmentProjectObjectiveToODS[]> {
    return this.findMany({ odsObjectiveId: objectiveId })
  }

  async existsByObjectivePair(
    projectObjectiveId: number,
    odsObjectiveId: number,
  ): Promise<boolean> {
    const record =
      await this.db.query.AlignmentProjectObjectiveWithODS.findFirst({
        where: (fields, { eq, and }) =>
          and(
            eq(fields.projectObjectiveId, projectObjectiveId),
            eq(fields.objectiveODSId, odsObjectiveId),
          ),
      })
    return record !== undefined
  }

  async save(
    alignment: AlignmentProjectObjectiveToODS,
  ): Promise<AlignmentProjectObjectiveToODS> {
    const data =
      AlignmentProjectObjectiveToODSPersistenceMapper.toPersistence(alignment)

    if (alignment.isNew) {
      const [inserted] = await this.db
        .insert(AlignmentProjectObjectiveWithODS)
        .values(data)
        .returning()
      return AlignmentProjectObjectiveToODSPersistenceMapper.toDomain(inserted)
    }

    throw new Error('Alignments cannot be updated, only created or deleted')
  }

  async delete(id: number): Promise<void> {
    await this.db
      .delete(AlignmentProjectObjectiveWithODS)
      .where(eq(AlignmentProjectObjectiveWithODS.id, id))
  }

  async deleteByObjectivePair(
    projectObjectiveId: number,
    odsObjectiveId: number,
  ): Promise<void> {
    await this.db
      .delete(AlignmentProjectObjectiveWithODS)
      .where(
        and(
          eq(
            AlignmentProjectObjectiveWithODS.projectObjectiveId,
            projectObjectiveId,
          ),
          eq(AlignmentProjectObjectiveWithODS.objectiveODSId, odsObjectiveId),
        ),
      )
  }
}
