import type { InstitutionPayload, InstitutionRecord } from '@sigep/db'
import {
  Institution,
  type InstitutionArea,
  type InstitutionLevel,
} from '~/domain/entities/Institution'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class InstitutionPersistenceMapper {
  static toDomain(record: InstitutionRecord): Institution {
    return Institution.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      area: record.area as InstitutionArea,
      level: record.level as InstitutionLevel,
      deletedAt: record.deletedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy,
      updatedAt: record.updatedAt,
    })
  }

  static toPersistence(entity: Institution): InstitutionPayload {
    return {
      uid: entity.uid,
      name: entity.name,
      area: entity.area,
      level: entity.level,
      deletedAt: entity.deletedAt,
      createdBy: entity.createdByUserId,
      updatedBy: entity.updatedByUserId ?? null,
    }
  }
}
