import type { IRepository, PaginationOptions } from '@sigep/shared'
import type { User } from '../entities/User'

export interface UserFilters {
  name?: string
  active?: boolean
}

export interface FindManyUsersOptions {
  where?: UserFilters
  pagination?: PaginationOptions
}

export interface IUserRepository extends IRepository<User> {
  findById(id: number): Promise<User | null>
  findByIds(ids: number[]): Promise<User[]>
  findByUid(uid: string): Promise<User | null>
  findByUidOrThrow(uid: string): Promise<User>
  findByName(name: string): Promise<User | null>
  findByPersonId(personId: number): Promise<User | null>
  findMany(options?: FindManyUsersOptions): Promise<User[]>
  save(user: User): Promise<User>
}
