import type { IListableRepository, PaginationOptions } from '@sigep/shared'
import type { ObjectivePND } from '../entities/ObjectivePND'

export interface ObjectivePNDFilters {
  name?: string
  active?: boolean
  id?: number[]
}

export interface FindManyObjectivePNDOptions {
  where?: ObjectivePNDFilters
  pagination?: PaginationOptions
}

export interface IObjectivePNDRepository
  extends IListableRepository<ObjectivePND, ObjectivePNDFilters> {
  findById(id: number): Promise<ObjectivePND | null>
  findByUid(uid: string): Promise<ObjectivePND | null>
  findByUidOrThrow(uid: string): Promise<ObjectivePND>
  findMany(options?: FindManyObjectivePNDOptions): Promise<ObjectivePND[]>
  count(where?: ObjectivePNDFilters): Promise<number>
  save(objective: ObjectivePND): Promise<ObjectivePND>
  delete(uid: string): Promise<void>
}
