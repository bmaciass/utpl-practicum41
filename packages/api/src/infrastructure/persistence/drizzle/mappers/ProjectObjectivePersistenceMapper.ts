import type { ProjectObjectivePayload, ProjectObjectiveRecord } from '@sigep/db'
import {
  ProjectObjective,
  type ProjectObjectiveStatus,
} from '~/domain/entities/ProjectObjective'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProjectObjectivePersistenceMapper {
  static toDomain(record: ProjectObjectiveRecord): ProjectObjective {
    return ProjectObjective.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      status: record.status as ProjectObjectiveStatus,
      projectId: record.projectId,
      deletedAt: record.deletedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy ?? undefined,
      updatedAt: record.updatedAt ?? undefined,
    })
  }

  static toPersistence(entity: ProjectObjective): ProjectObjectivePayload {
    return {
      uid: entity.uid,
      name: entity.name,
      status: entity.status,
      projectId: entity.projectId,
      deletedAt: entity.deletedAt,
      createdBy: entity.createdByUserId,
      updatedBy: entity.updatedByUserId ?? null,
    }
  }
}
