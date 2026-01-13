import type { Institution } from '~/domain/entities/Institution'
import type { InstitutionResponseDTO } from '../dto/institution'

export class InstitutionMapper {
  static toDTO(entity: Institution): InstitutionResponseDTO {
    return {
      uid: entity.uid,
      name: entity.name,
      area: entity.area,
      level: entity.level,
      active: entity.active,
      deletedAt: entity.deletedAt,
    }
  }

  static toDTOList(entities: Institution[]): InstitutionResponseDTO[] {
    return entities.map(this.toDTO)
  }
}
