import type { ObjectivePNDPayload, ObjectivePNDRecord } from '@sigep/db'
import { ObjectivePND } from '~/domain/entities/ObjectivePND'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ObjectivePNDPersistenceMapper {
  static toDomain(record: ObjectivePNDRecord): ObjectivePND {
    return ObjectivePND.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      description: record.description,
      deletedAt: record.deletedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy ?? undefined,
      updatedAt: record.updatedAt ?? undefined,
    })
  }

  static toPersistence(entity: ObjectivePND): ObjectivePNDPayload {
    return {
      uid: entity.uid,
      name: entity.name,
      description: entity.description,
      deletedAt: entity.deletedAt,
      createdBy: entity.createdByUserId,
      updatedBy: entity.updatedByUserId ?? null,
    }
  }
}
