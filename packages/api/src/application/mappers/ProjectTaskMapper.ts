import type { ProjectTask } from '~/domain/entities/ProjectTask'
import type { ProjectTaskResponseDTO } from '../dto/project-task'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProjectTaskMapper {
  static toDTO(entity: ProjectTask): ProjectTaskResponseDTO {
    return {
      uid: entity.uid,
      name: entity.name,
      description: entity.description,
      projectId: entity.projectId,
      responsibleId: entity.responsibleId,
      status: entity.status,
      startDate: entity.startDate,
      endDate: entity.endDate,
      active: entity.active,
      deletedAt: entity.deletedAt,
    }
  }

  static toDTOList(entities: ProjectTask[]): ProjectTaskResponseDTO[] {
    return entities.map(ProjectTaskMapper.toDTO)
  }
}
