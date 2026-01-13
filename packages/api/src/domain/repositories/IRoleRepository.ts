import type { IRepository } from '@sigep/shared'
import type { Role } from '../entities/Role'

export interface IRoleRepository extends IRepository<Role> {
  /**
   * Finds a role by its database ID
   * @param id - The role's database ID
   * @returns Role entity or null if not found
   */
  findById(id: number): Promise<Role | null>

  /**
   * Finds all roles assigned to a user
   * @param userId - The user's database ID
   * @returns Array of Role entities with their permissions
   */
  findByUserId(userId: number): Promise<Role[]>

  /**
   * Finds a role by its unique identifier
   * @param uid - The role's unique identifier
   * @returns Role entity or null if not found
   */
  findByUid(uid: string): Promise<Role | null>

  /**
   * Finds a role by its name
   * @param name - The role's name
   * @returns Role entity or null if not found
   */
  findByName(name: string): Promise<Role | null>

  /**
   * Saves a role (create or update)
   * @param role - The role entity to save
   * @returns Saved role entity
   */
  save(role: Role): Promise<Role>

  /**
   * Deletes a role by its database ID
   * @param id - The role's database ID
   */
  delete(uid: string): Promise<void>
}
