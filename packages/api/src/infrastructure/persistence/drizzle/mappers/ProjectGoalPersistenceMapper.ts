import type { ProjectGoalPayload, ProjectGoalRecord } from '@sigep/db'
import {
  ProjectGoal,
  type ProjectGoalStatus,
} from '~/domain/entities/ProjectGoal'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProjectGoalPersistenceMapper {
  static toDomain(record: ProjectGoalRecord): ProjectGoal {
    return ProjectGoal.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      projectId: record.projectId,
      status: record.status as ProjectGoalStatus,
      startDate: record.startDate,
      endDate: record.endDate,
      deletedAt: record.deletedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy ?? undefined,
      updatedAt: record.updatedAt,
    })
  }

  static toPersistence(entity: ProjectGoal): ProjectGoalPayload {
    return {
      uid: entity.uid,
      name: entity.name,
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
