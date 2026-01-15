import type { PaginationOptions } from '@sigep/shared'
import type { TStringFilter } from '~/helpers/filter-inputs'
import type { ObjectiveODS } from '../entities/ObjectiveODS'

export interface ObjectiveODSFilters {
  name?: TStringFilter
  active?: boolean
}

export interface FindManyObjectiveODSOptions {
  where?: ObjectiveODSFilters
  pagination?: PaginationOptions
}

export interface IObjectiveODSRepository {
  findById(id: number): Promise<ObjectiveODS | null>
  findByUid(uid: string): Promise<ObjectiveODS | null>
  findByUidOrThrow(uid: string): Promise<ObjectiveODS>
  findMany(options?: FindManyObjectiveODSOptions): Promise<ObjectiveODS[]>
  count(where?: ObjectiveODSFilters): Promise<number>
}
