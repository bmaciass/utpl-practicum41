import type { ProjectPayload, ProjectRecord } from '@sigep/db'
import { Project, type ProjectStatus } from '~/domain/entities/Project'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProjectPersistenceMapper {
  static toDomain(record: ProjectRecord): Project {
    return Project.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      description: record.description,
      status: record.status as ProjectStatus,
      startDate: record.startDate,
      endDate: record.endDate,
      responsibleId: record.responsibleId,
      programId: record.programId,
      deletedAt: record.deletedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy,
      updatedAt: record.updatedAt,
    })
  }

  static toPersistence(entity: Project): ProjectPayload {
    return {
      uid: entity.uid,
      name: entity.name,
      description: entity.description ?? null,
      status: entity.status,
      startDate: entity.startDate ?? null,
      endDate: entity.endDate ?? null,
      responsibleId: entity.responsibleId,
      programId: entity.programId,
      deletedAt: entity.deletedAt,
      createdBy: entity.createdByUserId,
      updatedBy: entity.updatedByUserId ?? null,
    }
  }
}
