import type { ObjectiveODS } from '~/domain/entities/ObjectiveODS'
import type { ObjectiveODSResponseDTO } from '../dto/objectiveODS/ObjectiveODSResponseDTO'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ObjectiveODSMapper {
  static toDTO(objectiveODS: ObjectiveODS): ObjectiveODSResponseDTO {
    return {
      id: objectiveODS.id,
      uid: objectiveODS.uid,
      name: objectiveODS.name,
      description: objectiveODS.description,
      active: objectiveODS.active,
      deletedAt: objectiveODS.deletedAt,
    }
  }

  static toDTOList(entities: ObjectiveODS[]): ObjectiveODSResponseDTO[] {
    return entities.map(ObjectiveODSMapper.toDTO)
  }
}
