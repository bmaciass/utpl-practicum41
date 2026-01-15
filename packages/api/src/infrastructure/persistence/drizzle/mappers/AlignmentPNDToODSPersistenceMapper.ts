import type {
  AlignmentObjectivePNDWithODSPayload,
  AlignmentObjectivePNDWithODSRecord,
} from '@sigep/db'
import { AlignmentPNDToODS } from '~/domain/entities/AlignmentPNDToODS'

export class AlignmentPNDToODSPersistenceMapper {
  static toDomain(
    record: AlignmentObjectivePNDWithODSRecord,
  ): AlignmentPNDToODS {
    return AlignmentPNDToODS.reconstitute({
      id: record.id,
      pndObjectiveId: record.objectivePNDId,
      odsObjectiveId: record.objectiveODSId,
      createdByUserId: record.createdBy,
      createdAt: record.createdAt,
      updatedByUserId: record.updatedBy ?? undefined,
      updatedAt: record.updatedAt ?? undefined,
    })
  }

  static toDomainList(
    records: AlignmentObjectivePNDWithODSRecord[],
  ): AlignmentPNDToODS[] {
    return records.map(AlignmentPNDToODSPersistenceMapper.toDomain)
  }

  static toPersistence(
    entity: AlignmentPNDToODS,
  ): AlignmentObjectivePNDWithODSPayload {
    return {
      objectivePNDId: entity.pndObjectiveId,
      objectiveODSId: entity.odsObjectiveId,
      createdBy: entity.createdByUserId,
      updatedBy: entity.updatedByUserId ?? null,
    }
  }
}
