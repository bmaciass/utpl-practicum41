import type {
  AlignmentObjectiveStrategicWithPNDPayload,
  AlignmentObjectiveStrategicWithPNDRecord,
} from '@sigep/db'
import { AlignmentInstitutionalToPND } from '~/domain/entities/AlignmentInstitutionalToPND'

export class AlignmentInstitutionalToPNDPersistenceMapper {
  static toDomain(
    record: AlignmentObjectiveStrategicWithPNDRecord,
  ): AlignmentInstitutionalToPND {
    return AlignmentInstitutionalToPND.reconstitute({
      id: record.id,
      institutionalObjectiveId: record.objectiveStrategicId,
      pndObjectiveId: record.objectivePNDId,
      createdByUserId: record.createdBy,
      createdAt: record.createdAt,
      updatedByUserId: record.updatedBy ?? undefined,
      updatedAt: record.updatedAt ?? undefined,
    })
  }

  static toDomainList(
    records: AlignmentObjectiveStrategicWithPNDRecord[],
  ): AlignmentInstitutionalToPND[] {
    return records.map(AlignmentInstitutionalToPNDPersistenceMapper.toDomain)
  }

  static toPersistence(
    entity: AlignmentInstitutionalToPND,
  ): AlignmentObjectiveStrategicWithPNDPayload {
    return {
      objectiveStrategicId: entity.institutionalObjectiveId,
      objectivePNDId: entity.pndObjectiveId,
      createdBy: entity.createdByUserId,
      updatedBy: entity.updatedByUserId ?? null,
    }
  }
}
