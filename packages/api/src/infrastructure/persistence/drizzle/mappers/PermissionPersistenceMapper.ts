import type {
  Permission,
  PermissionAction,
  PermissionEffect,
  PermissionScope,
} from '~/domain/entities/Permission'

/**
 * Database record for PermissionRole table
 */
export interface PermissionRoleRecord {
  action: PermissionAction
  effect: PermissionEffect
  scope: PermissionScope
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PermissionPersistenceMapper {
  static toDomain(record: PermissionRoleRecord): Permission {
    return {
      action: record.action,
      effect: record.effect,
      scope: record.scope,
    }
  }
}
