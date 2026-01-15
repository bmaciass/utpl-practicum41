import type { Db } from '@sigep/db'
import { AlignmentObjectiveStrategicWithPND } from '@sigep/db'
import { type SQL, and, eq } from 'drizzle-orm'
import type { AlignmentInstitutionalToPND } from '~/domain/entities/AlignmentInstitutionalToPND'
import type {
  AlignmentInstitutionalToPNDFilters,
  IAlignmentInstitutionalToPNDRepository,
} from '~/domain/repositories/IAlignmentInstitutionalToPNDRepository'
import { AlignmentInstitutionalToPNDPersistenceMapper } from '../mappers/AlignmentInstitutionalToPNDPersistenceMapper'

export class DrizzleAlignmentInstitutionalToPNDRepository
  implements IAlignmentInstitutionalToPNDRepository
{
  constructor(private db: Db) {}

  async findById(id: number): Promise<AlignmentInstitutionalToPND | null> {
    const record =
      await this.db.query.AlignmentObjectiveStrategicWithPND.findFirst({
        where: (fields, { eq }) => eq(fields.id, id),
      })
    return record
      ? AlignmentInstitutionalToPNDPersistenceMapper.toDomain(record)
      : null
  }

  async findMany(
    filters?: AlignmentInstitutionalToPNDFilters,
  ): Promise<AlignmentInstitutionalToPND[]> {
    const conditions: SQL[] = []

    if (filters?.institutionalObjectiveId) {
      conditions.push(
        eq(
          AlignmentObjectiveStrategicWithPND.objectiveStrategicId,
          filters.institutionalObjectiveId,
        ),
      )
    }
    if (filters?.pndObjectiveId) {
      conditions.push(
        eq(
          AlignmentObjectiveStrategicWithPND.objectivePNDId,
          filters.pndObjectiveId,
        ),
      )
    }

    const records =
      await this.db.query.AlignmentObjectiveStrategicWithPND.findMany({
        where: conditions.length > 0 ? () => and(...conditions) : undefined,
      })

    return AlignmentInstitutionalToPNDPersistenceMapper.toDomainList(records)
  }

  async findByInstitutionalObjectiveId(
    objectiveId: number,
  ): Promise<AlignmentInstitutionalToPND[]> {
    return this.findMany({ institutionalObjectiveId: objectiveId })
  }

  async findByPNDObjectiveId(
    objectiveId: number,
  ): Promise<AlignmentInstitutionalToPND[]> {
    return this.findMany({ pndObjectiveId: objectiveId })
  }

  async existsByObjectivePair(
    institutionalId: number,
    pndId: number,
  ): Promise<boolean> {
    const record =
      await this.db.query.AlignmentObjectiveStrategicWithPND.findFirst({
        where: (fields, { eq, and }) =>
          and(
            eq(fields.objectiveStrategicId, institutionalId),
            eq(fields.objectivePNDId, pndId),
          ),
      })
    return record !== undefined
  }

  async save(
    alignment: AlignmentInstitutionalToPND,
  ): Promise<AlignmentInstitutionalToPND> {
    const data =
      AlignmentInstitutionalToPNDPersistenceMapper.toPersistence(alignment)

    if (alignment.isNew) {
      const [inserted] = await this.db
        .insert(AlignmentObjectiveStrategicWithPND)
        .values(data)
        .returning()
      return AlignmentInstitutionalToPNDPersistenceMapper.toDomain(inserted)
    }

    // Alignments are immutable, so update shouldn't happen
    // But keeping for consistency with repository pattern
    throw new Error('Alignments cannot be updated, only created or deleted')
  }

  async delete(id: number): Promise<void> {
    await this.db
      .delete(AlignmentObjectiveStrategicWithPND)
      .where(eq(AlignmentObjectiveStrategicWithPND.id, id))
  }

  async deleteByObjectivePair(
    institutionalId: number,
    pndId: number,
  ): Promise<void> {
    await this.db
      .delete(AlignmentObjectiveStrategicWithPND)
      .where(
        and(
          eq(
            AlignmentObjectiveStrategicWithPND.objectiveStrategicId,
            institutionalId,
          ),
          eq(AlignmentObjectiveStrategicWithPND.objectivePNDId, pndId),
        ),
      )
  }
}
