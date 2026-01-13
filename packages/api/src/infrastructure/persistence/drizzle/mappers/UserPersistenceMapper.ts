import type { UserPayload, UserRecord } from '@sigep/db'
import { User } from '~/domain/entities/User'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserPersistenceMapper {
  static toDomain(record: UserRecord): User {
    return User.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      passwordHash: record.password,
      salt: record.salt,
      personId: record.personId,
      deletedAt: record.deletedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  }

  static toPersistence(entity: User): UserPayload {
    return {
      uid: entity.uid,
      name: entity.name,
      password: entity.password,
      salt: entity.salt,
      personId: entity.personId,
      deletedAt: entity.deletedAt,
    }
  }
}
