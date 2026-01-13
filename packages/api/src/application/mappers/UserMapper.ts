import type { User } from '~/domain/entities/User'
import type { UserResponseDTO } from '../dto/user'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserMapper {
  static toDTO(entity: User): UserResponseDTO {
    return {
      id: entity.id,
      uid: entity.uid,
      name: entity.name,
      personId: entity.personId,
      active: entity.active,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
