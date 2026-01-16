import type { IListableRepository, PaginationOptions } from '@sigep/shared'
import type { InstitutionalObjective } from '../entities/InstitutionalObjective'

export interface InstitutionalObjectiveFilters {
  name?: string
  active?: boolean
  institutionId?: number
  id?: number[]
}

export interface FindManyInstitutionalObjectivesOptions {
  where?: InstitutionalObjectiveFilters
  pagination?: PaginationOptions
}

export interface IInstitutionalObjectiveRepository
  extends IListableRepository<
    InstitutionalObjective,
    InstitutionalObjectiveFilters
  > {
  findById(id: number): Promise<InstitutionalObjective | null>
  findByIds(ids: number[]): Promise<InstitutionalObjective[]>
  findByUid(uid: string): Promise<InstitutionalObjective | null>
  findByUidOrThrow(uid: string): Promise<InstitutionalObjective>
  findMany(
    options?: FindManyInstitutionalObjectivesOptions,
  ): Promise<InstitutionalObjective[]>
  count(where?: InstitutionalObjectiveFilters): Promise<number>
  save(objective: InstitutionalObjective): Promise<InstitutionalObjective>
  delete(uid: string): Promise<void>
}
