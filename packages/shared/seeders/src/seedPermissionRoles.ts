import { type Db, PermissionRole, Role } from '@sigep/db'
import { inArray } from 'drizzle-orm'
import { nanoid } from 'nanoid/non-secure'

export async function seedPermissionRoles(db: Db, userId: number) {
  const roles = await db
    .select()
    .from(Role)
    .where(inArray(Role.name, ['admin', 'operador']))

  const roleByName = new Map(roles.map((role) => [role.name, role.id]))

  const permissions = [
    { role: 'admin', action: 'create', effect: 'allow', scope: 'module' },
    { role: 'admin', action: 'read', effect: 'allow', scope: 'module' },
    { role: 'admin', action: 'update', effect: 'allow', scope: 'module' },
    { role: 'admin', action: 'delete', effect: 'allow', scope: 'module' },
    { role: 'admin', action: 'list', effect: 'allow', scope: 'module' },
    { role: 'admin', action: 'approve', effect: 'allow', scope: 'module' },
    { role: 'operador', action: 'read', effect: 'allow', scope: 'resource' },
    { role: 'operador', action: 'list', effect: 'allow', scope: 'resource' },
    { role: 'operador', action: 'update', effect: 'allow', scope: 'resource' },
  ]

  const records = permissions
    .map((permission) => {
      const roleId = roleByName.get(permission.role)
      if (!roleId) {
        console.warn(`Role not found for permission: ${permission.role}`)
        return null
      }
      return {
        uid: nanoid(),
        roleId,
        action: permission.action,
        effect: permission.effect,
        scope: permission.scope,
        createdBy: userId,
      }
    })
    .filter(Boolean) as Array<{
    uid: string
    roleId: number
    action: 'create' | 'read' | 'update' | 'delete' | 'list' | 'approve'
    effect: 'allow' | 'deny'
    scope: 'module' | 'resource'
    createdBy: number
  }>

  if (!records.length) {
    console.warn('No permission-role records inserted.')
    return
  }

  await db.insert(PermissionRole).values(records)
}
