import type { ObjectiveODSRecord } from '@sigep/db'
import { ObjectiveODS } from '~/domain/entities/ObjectiveODS'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ObjectiveODSPersistenceMapper {
  static toDomain(record: ObjectiveODSRecord): ObjectiveODS {
    return ObjectiveODS.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      description: record.description,
      deletedAt: record.deletedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy,
      updatedAt: record.updatedAt,
    })
  }

  static toDomainList(records: ObjectiveODSRecord[]): ObjectiveODS[] {
    return records.map(ObjectiveODSPersistenceMapper.toDomain)
  }
}
