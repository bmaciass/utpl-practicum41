import type { ProjectGoal } from '~/domain/entities/ProjectGoal'
import type { ProjectGoalResponseDTO } from '../dto/project-goal'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProjectGoalMapper {
  static toDTO(entity: ProjectGoal): ProjectGoalResponseDTO {
    return {
      uid: entity.uid,
      name: entity.name,
      projectId: entity.projectId,
      status: entity.status,
      startDate: entity.startDate,
      endDate: entity.endDate,
      active: entity.active,
      deletedAt: entity.deletedAt,
    }
  }

  static toDTOList(entities: ProjectGoal[]): ProjectGoalResponseDTO[] {
    return entities.map(ProjectGoalMapper.toDTO)
  }
}
