import type { Person } from '~/domain/entities/Person'
import type { PersonResponseDTO } from '../dto/person'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PersonMapper {
  static toDTO(entity: Person): PersonResponseDTO {
    return {
      id: entity.id,
      uid: entity.uid,
      firstName: entity.firstName,
      lastName: entity.lastName,
      fullName: entity.fullName,
      dni: entity.dni,
      active: entity.active,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
