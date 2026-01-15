import type {
  InstitutionEstrategicObjetivePayload,
  InstitutionEstrategicObjetiveRecord,
} from '@sigep/db'
import { InstitutionalObjective } from '~/domain/entities/InstitutionalObjective'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class InstitutionalObjectivePersistenceMapper {
  static toDomain(
    record: InstitutionEstrategicObjetiveRecord,
  ): InstitutionalObjective {
    return InstitutionalObjective.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      description: record.description,
      institutionId: record.institutionId,
      deletedAt: record.deletedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy ?? undefined,
      updatedAt: record.updatedAt ?? undefined,
    })
  }

  static toPersistence(
    entity: InstitutionalObjective,
  ): InstitutionEstrategicObjetivePayload {
    return {
      uid: entity.uid,
      name: entity.name,
      description: entity.description,
      institutionId: entity.institutionId,
      deletedAt: entity.deletedAt,
      createdBy: entity.createdByUserId,
      updatedBy: entity.updatedByUserId ?? null,
    }
  }
}
