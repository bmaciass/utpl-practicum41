import type {
  InstitutionalPlanPayload,
  InstitutionalPlanRecord,
} from '@sigep/db'
import { InstitutionalPlan } from '~/domain/entities/InstitutionalPlan'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class InstitutionalPlanPersistenceMapper {
  static toDomain(record: InstitutionalPlanRecord): InstitutionalPlan {
    return InstitutionalPlan.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      description: record.description,
      year: record.year,
      url: record.url ?? null,
      institutionId: record.institutionId,
      deletedAt: record.deletedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy ?? undefined,
      updatedAt: record.updatedAt ?? undefined,
    })
  }

  static toPersistence(entity: InstitutionalPlan): InstitutionalPlanPayload {
    return {
      uid: entity.uid,
      name: entity.name,
      description: entity.description,
      year: entity.year,
      url: entity.url ?? null,
      institutionId: entity.institutionId,
      deletedAt: entity.deletedAt,
      createdBy: entity.createdByUserId,
      updatedBy: entity.updatedByUserId ?? null,
    }
  }
}
