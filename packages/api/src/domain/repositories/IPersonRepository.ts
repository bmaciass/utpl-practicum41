import type { IRepository, PaginationOptions } from '@sigep/shared'
import type { Person } from '../entities/Person'

export interface PersonFilters {
  firstName?: string
  lastName?: string
  dni?: string
  active?: boolean
}

export interface FindManyPersonsOptions {
  where?: PersonFilters
  pagination?: PaginationOptions
}

export interface IPersonRepository extends IRepository<Person> {
  findById(id: number): Promise<Person | null>
  findByUid(uid: string): Promise<Person | null>
  findByIds(ids: number[]): Promise<Person[]>
  findByUidOrThrow(uid: string): Promise<Person>
  findByDni(dni: string): Promise<Person | null>
  findMany(options?: FindManyPersonsOptions): Promise<Person[]>
  save(person: Person): Promise<Person>
  delete(uid: string): Promise<void>
}
