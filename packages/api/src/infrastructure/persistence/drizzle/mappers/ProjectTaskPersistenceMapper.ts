import type { ProjectTaskPayload, ProjectTaskRecord } from '@sigep/db'
import {
  ProjectTask,
  type ProjectTaskStatus,
} from '~/domain/entities/ProjectTask'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProjectTaskPersistenceMapper {
  static toDomain(record: ProjectTaskRecord): ProjectTask {
    return ProjectTask.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      description: record.description,
      projectId: record.projectId,
      responsibleId: record.responsibleId,
      status: record.status as ProjectTaskStatus,
      startDate: record.startDate,
      endDate: record.endDate,
      deletedAt: record.deletedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy ?? undefined,
      updatedAt: record.updatedAt,
    })
  }

  static toPersistence(entity: ProjectTask): ProjectTaskPayload {
    return {
      uid: entity.uid,
      name: entity.name,
      responsibleId: entity.responsibleId,
      projectId: entity.projectId,
      status: entity.status,
      startDate: entity.startDate ?? null,
      endDate: entity.endDate ?? null,
      deletedAt: entity.deletedAt,
      createdBy: entity.createdByUserId,
      updatedBy: entity.updatedByUserId ?? null,
    }
  }
}
