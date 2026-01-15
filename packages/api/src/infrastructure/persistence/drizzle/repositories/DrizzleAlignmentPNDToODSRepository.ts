import { and, eq, type SQL } from 'drizzle-orm'
import type { Db } from '@sigep/db'
import { AlignmentObjectivePNDWithODS } from '@sigep/db'
import type { AlignmentPNDToODS } from '~/domain/entities/AlignmentPNDToODS'
import type {
  AlignmentPNDToODSFilters,
  IAlignmentPNDToODSRepository,
} from '~/domain/repositories/IAlignmentPNDToODSRepository'
import { AlignmentPNDToODSPersistenceMapper } from '../mappers/AlignmentPNDToODSPersistenceMapper'

export class DrizzleAlignmentPNDToODSRepository
  implements IAlignmentPNDToODSRepository
{
  constructor(private db: Db) {}

  async findById(id: number): Promise<AlignmentPNDToODS | null> {
    const record = await this.db.query.AlignmentObjectivePNDWithODS.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
    })
    return record ? AlignmentPNDToODSPersistenceMapper.toDomain(record) : null
  }

  async findMany(
    filters?: AlignmentPNDToODSFilters,
  ): Promise<AlignmentPNDToODS[]> {
    const conditions: SQL[] = []

    if (filters?.pndObjectiveId) {
      conditions.push(
        eq(AlignmentObjectivePNDWithODS.objectivePNDId, filters.pndObjectiveId),
      )
    }
    if (filters?.odsObjectiveId) {
      conditions.push(
        eq(AlignmentObjectivePNDWithODS.objectiveODSId, filters.odsObjectiveId),
      )
    }

    const records = await this.db.query.AlignmentObjectivePNDWithODS.findMany({
      where: conditions.length > 0 ? () => and(...conditions) : undefined,
    })

    return AlignmentPNDToODSPersistenceMapper.toDomainList(records)
  }

  async findByPNDObjectiveId(
    objectiveId: number,
  ): Promise<AlignmentPNDToODS[]> {
    return this.findMany({ pndObjectiveId: objectiveId })
  }

  async findByODSObjectiveId(
    objectiveId: number,
  ): Promise<AlignmentPNDToODS[]> {
    return this.findMany({ odsObjectiveId: objectiveId })
  }

  async existsByObjectivePair(pndId: number, odsId: number): Promise<boolean> {
    const record = await this.db.query.AlignmentObjectivePNDWithODS.findFirst({
      where: (fields, { eq, and }) =>
        and(eq(fields.objectivePNDId, pndId), eq(fields.objectiveODSId, odsId)),
    })
    return record !== undefined
  }

  async save(alignment: AlignmentPNDToODS): Promise<AlignmentPNDToODS> {
    const data = AlignmentPNDToODSPersistenceMapper.toPersistence(alignment)

    if (alignment.isNew) {
      const [inserted] = await this.db
        .insert(AlignmentObjectivePNDWithODS)
        .values(data)
        .returning()
      return AlignmentPNDToODSPersistenceMapper.toDomain(inserted)
    }

    // Alignments are immutable, so update shouldn't happen
    // But keeping for consistency with repository pattern
    throw new Error('Alignments cannot be updated, only created or deleted')
  }

  async delete(id: number): Promise<void> {
    await this.db
      .delete(AlignmentObjectivePNDWithODS)
      .where(eq(AlignmentObjectivePNDWithODS.id, id))
  }

  async deleteByObjectivePair(pndId: number, odsId: number): Promise<void> {
    await this.db
      .delete(AlignmentObjectivePNDWithODS)
      .where(
        and(
          eq(AlignmentObjectivePNDWithODS.objectivePNDId, pndId),
          eq(AlignmentObjectivePNDWithODS.objectiveODSId, odsId),
        ),
      )
  }
}
