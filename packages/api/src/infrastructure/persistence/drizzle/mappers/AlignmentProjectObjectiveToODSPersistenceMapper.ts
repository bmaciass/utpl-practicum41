import type {
  AlignmentProjectObjectiveWithODSPayload,
  AlignmentProjectObjectiveWithODSRecord,
} from '@sigep/db'
import { AlignmentProjectObjectiveToODS } from '~/domain/entities/AlignmentProjectObjectiveToODS'

export class AlignmentProjectObjectiveToODSPersistenceMapper {
  static toDomain(
    record: AlignmentProjectObjectiveWithODSRecord,
  ): AlignmentProjectObjectiveToODS {
    return AlignmentProjectObjectiveToODS.reconstitute({
      id: record.id,
      projectObjectiveId: record.projectObjectiveId,
      odsObjectiveId: record.objectiveODSId,
      createdByUserId: record.createdBy,
      createdAt: record.createdAt,
      updatedByUserId: record.updatedBy ?? undefined,
      updatedAt: record.updatedAt ?? undefined,
    })
  }

  static toDomainList(
    records: AlignmentProjectObjectiveWithODSRecord[],
  ): AlignmentProjectObjectiveToODS[] {
    return records.map(AlignmentProjectObjectiveToODSPersistenceMapper.toDomain)
  }

  static toPersistence(
    entity: AlignmentProjectObjectiveToODS,
  ): AlignmentProjectObjectiveWithODSPayload {
    return {
      projectObjectiveId: entity.projectObjectiveId,
      objectiveODSId: entity.odsObjectiveId,
      createdBy: entity.createdByUserId,
      updatedBy: entity.updatedByUserId ?? null,
    }
  }
}
