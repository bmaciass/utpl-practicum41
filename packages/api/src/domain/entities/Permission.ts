/**
 * Permission action types
 */
export type PermissionAction =
  | 'create'
  | 'delete'
  | 'read'
  | 'update'
  | 'list'
  | 'approve'

/**
 * Permission effect types
 */
export type PermissionEffect = 'allow' | 'deny'

/**
 * Permission scope types
 */
export type PermissionScope = 'module' | 'resource'

/**
 * Permission value object representing a single permission
 */
export interface Permission {
  action: PermissionAction
  effect: PermissionEffect
  scope: PermissionScope
}

/**
 * Formats a permission as a string in the format "scope:action:effect"
 * @param permission - The permission to format
 * @returns Formatted permission string (e.g., "resource:read:allow")
 */
export function formatPermission(permission: Permission): string {
  return `${permission.scope}:${permission.action}:${permission.effect}`
}

/**
 * Parses a permission string into a Permission object
 * @param permissionString - String in format "scope:action:effect"
 * @returns Permission object
 * @throws Error if the string format is invalid
 */
export function parsePermission(permissionString: string): Permission {
  const parts = permissionString.split(':')
  if (parts.length !== 3) {
    throw new Error(`Invalid permission format: ${permissionString}`)
  }

  const [scope, action, effect] = parts

  return {
    scope: scope as PermissionScope,
    action: action as PermissionAction,
    effect: effect as PermissionEffect,
  }
}
