import type { ProgramPayload, ProgramRecord } from '@sigep/db'
import { Program } from '~/domain/entities/Program'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProgramPersistenceMapper {
  static toDomain(record: ProgramRecord): Program {
    return Program.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      description: record.description,
      startDate: record.startDate,
      endDate: record.endDate,
      responsibleId: record.responsibleId,
      deletedAt: record.deletedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy,
      updatedAt: record.updatedAt,
    })
  }

  static toPersistence(entity: Program): ProgramPayload {
    return {
      uid: entity.uid,
      name: entity.name,
      description: entity.description ?? null,
      startDate: entity.startDate ?? null,
      endDate: entity.endDate ?? null,
      responsibleId: entity.responsibleId,
      deletedAt: entity.deletedAt,
      createdBy: entity.createdByUserId,
      updatedBy: entity.updatedByUserId ?? null,
    }
  }
}
