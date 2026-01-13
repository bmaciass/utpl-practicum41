import type { Project } from '~/domain/entities/Project'
import type { ProjectResponseDTO } from '../dto/project'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProjectMapper {
  static toDTO(entity: Project): ProjectResponseDTO {
    return {
      id: entity.id,
      uid: entity.uid,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      startDate: entity.startDate,
      endDate: entity.endDate,
      responsibleId: entity.responsibleId,
      programId: entity.programId,
      active: entity.active,
      deletedAt: entity.deletedAt,
    }
  }

  static toDTOList(entities: Project[]): ProjectResponseDTO[] {
    return entities.map(ProjectMapper.toDTO)
  }
}
