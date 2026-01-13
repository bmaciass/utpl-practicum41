import type { Db } from '@sigep/db'
import { PermissionRole, Role as RoleTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { eq, inArray } from 'drizzle-orm'
import type { Role } from '~/domain/entities/Role'
import type { IRoleRepository } from '~/domain/repositories/IRoleRepository'
import { PermissionPersistenceMapper } from '../mappers/PermissionPersistenceMapper'
import { RolePersistenceMapper } from '../mappers/RolePersistenceMapper'

export class DrizzleRoleRepository implements IRoleRepository {
  constructor(private db: Db) {}

  async findById(id: number): Promise<Role | null> {
    const record = await this.db.query.Role.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })

    if (!record) return null

    const permissions = await this.loadPermissionsForRole(id)
    return RolePersistenceMapper.toDomain(record, permissions)
  }

  async findByUserId(userId: number): Promise<Role[]> {
    // 1. Get all role IDs for this user from UserRole table
    const userRoles = await this.db.query.UserRole.findMany({
      where: (fields, ops) => ops.eq(fields.userId, userId),
    })

    if (userRoles.length === 0) {
      return []
    }

    const roleIds = userRoles.map((ur) => ur.roleId)

    // 2. Get role records
    const roleRecords = await this.db
      .select()
      .from(RoleTable)
      .where(inArray(RoleTable.id, roleIds))

    // 3. Get permissions for these roles
    const permissionRecords = await this.db
      .select({
        roleId: PermissionRole.roleId,
        action: PermissionRole.action,
        effect: PermissionRole.effect,
        scope: PermissionRole.scope,
      })
      .from(PermissionRole)
      .where(inArray(PermissionRole.roleId, roleIds))

    // 4. Group permissions by roleId
    const permissionsByRole = new Map<number, typeof permissionRecords>()
    for (const perm of permissionRecords) {
      const existing = permissionsByRole.get(perm.roleId) || []
      existing.push(perm)
      permissionsByRole.set(perm.roleId, existing)
    }

    // 5. Map to domain entities
    return roleRecords.map((roleRecord) => {
      const rolePermissions = permissionsByRole.get(roleRecord.id) || []
      const permissions = rolePermissions.map((p) =>
        PermissionPersistenceMapper.toDomain(p),
      )
      return RolePersistenceMapper.toDomain(roleRecord, permissions)
    })
  }

  async findByUid(uid: string): Promise<Role | null> {
    const record = await this.db.query.Role.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })

    if (!record) return null

    const permissions = await this.loadPermissionsForRole(record.id)
    return RolePersistenceMapper.toDomain(record, permissions)
  }

  async findByUidOrThrow(uid: string): Promise<Role> {
    const record = await this.db.query.Role.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })

    if (!record) throw new NotFoundError('role', uid, 'uid')

    const permissions = await this.loadPermissionsForRole(record.id)
    return RolePersistenceMapper.toDomain(record, permissions)
  }

  async findByName(name: string): Promise<Role | null> {
    const record = await this.db.query.Role.findFirst({
      where: (fields, ops) => ops.eq(fields.name, name),
    })

    if (!record) return null

    const permissions = await this.loadPermissionsForRole(record.id)
    return RolePersistenceMapper.toDomain(record, permissions)
  }

  async save(role: Role): Promise<Role> {
    const data = RolePersistenceMapper.toPersistence(role)

    if (role.isNew) {
      const [inserted] = await this.db
        .insert(RoleTable)
        .values(data)
        .returning()
      const permissions = await this.loadPermissionsForRole(inserted.id)
      return RolePersistenceMapper.toDomain(inserted, permissions)
    }

    const [updated] = await this.db
      .update(RoleTable)
      .set(data)
      .where(eq(RoleTable.id, role.id))
      .returning()
    const permissions = await this.loadPermissionsForRole(updated.id)
    return RolePersistenceMapper.toDomain(updated, permissions)
  }

  async delete(uid: string): Promise<void> {
    await this.db.delete(RoleTable).where(eq(RoleTable.uid, uid))
  }

  /**
   * Helper method to load permissions for a role
   */
  private async loadPermissionsForRole(roleId: number) {
    const permissionRecords = await this.db
      .select({
        action: PermissionRole.action,
        effect: PermissionRole.effect,
        scope: PermissionRole.scope,
      })
      .from(PermissionRole)
      .where(eq(PermissionRole.roleId, roleId))

    return permissionRecords.map((p) => PermissionPersistenceMapper.toDomain(p))
  }
}
