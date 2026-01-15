import type { ObjectivePND } from '~/domain/entities/ObjectivePND'
import type { ObjectivePNDResponseDTO } from '../dto/objective-pnd'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ObjectivePNDMapper {
  static toDTO(objective: ObjectivePND): ObjectivePNDResponseDTO {
    return {
      id: objective.id,
      uid: objective.uid,
      name: objective.name,
      description: objective.description,
      active: objective.active,
      deletedAt: objective.deletedAt,
    }
  }

  static toDTOList(objectives: ObjectivePND[]): ObjectivePNDResponseDTO[] {
    return objectives.map(ObjectivePNDMapper.toDTO)
  }
}
