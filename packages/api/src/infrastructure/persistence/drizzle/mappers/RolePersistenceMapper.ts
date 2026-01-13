import type { RoleRecord, RolePayload } from '@sigep/db'
import { Role } from '~/domain/entities/Role'
import type { Permission } from '~/domain/entities/Permission'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class RolePersistenceMapper {
  /**
   * Converts a database record to a Role domain entity
   * @param record - Role database record
   * @param permissions - Array of permissions for this role
   * @returns Role domain entity
   */
  static toDomain(record: RoleRecord, permissions: Permission[]): Role {
    return Role.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      permissions,
      createdAt: record.createdAt,
      createdBy: record.createdBy ?? 0, // FIXME: Handle null createdBy
      updatedAt: record.updatedAt,
      updatedBy: record.updatedBy,
      deletedAt: record.deletedAt,
    })
  }

  static toPersistence(entity: Role): RolePayload {
    return {
      uid: entity.uid,
      name: entity.name,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
      deletedAt: entity.deletedAt,
    }
  }
}
