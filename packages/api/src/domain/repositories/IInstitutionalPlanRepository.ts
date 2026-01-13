import type { IListableRepository, PaginationOptions } from '@sigep/shared'
import type { InstitutionalPlan } from '../entities/InstitutionalPlan'

export interface InstitutionalPlanFilters {
  institutionId?: number
  year?: number
  active?: boolean
}

export interface FindManyInstitutionalPlansOptions {
  where?: InstitutionalPlanFilters
  pagination?: PaginationOptions
}

export interface IInstitutionalPlanRepository
  extends IListableRepository<InstitutionalPlan, InstitutionalPlanFilters> {
  findById(id: number): Promise<InstitutionalPlan | null>
  findByUid(uid: string): Promise<InstitutionalPlan | null>
  findByUidOrThrow(uid: string): Promise<InstitutionalPlan>
  findMany(
    options?: FindManyInstitutionalPlansOptions,
  ): Promise<InstitutionalPlan[]>
  count(where?: InstitutionalPlanFilters): Promise<number>
  save(plan: InstitutionalPlan): Promise<InstitutionalPlan>
  delete(uid: string): Promise<void>
}
