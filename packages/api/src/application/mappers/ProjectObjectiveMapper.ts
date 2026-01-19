import type { ProjectObjective } from '~/domain/entities/ProjectObjective'
import type { ProjectObjectiveResponseDTO } from '../dto/project-objective'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProjectObjectiveMapper {
  static toDTO(entity: ProjectObjective): ProjectObjectiveResponseDTO {
    return {
      id: entity.id,
      uid: entity.uid,
      name: entity.name,
      status: entity.status,
      projectId: entity.projectId,
      active: entity.active,
      deletedAt: entity.deletedAt,
    }
  }

  static toDTOList(
    entities: ProjectObjective[],
  ): ProjectObjectiveResponseDTO[] {
    return entities.map(ProjectObjectiveMapper.toDTO)
  }
}
