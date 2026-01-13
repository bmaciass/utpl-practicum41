import type { PaginationOptions } from '@sigep/shared'
import type {
  IInstitutionalPlanRepository,
  InstitutionalPlanFilters,
} from '~/domain/repositories/IInstitutionalPlanRepository'
import type { InstitutionalPlanResponseDTO } from '../../dto/institutional-plan'
import { InstitutionalPlanMapper } from '../../mappers/InstitutionalPlanMapper'

export interface ListInstitutionalPlansInput {
  filters?: InstitutionalPlanFilters
  pagination?: PaginationOptions
}

export interface ListInstitutionalPlansDeps {
  institutionalPlanRepository: IInstitutionalPlanRepository
}

export class ListInstitutionalPlans {
  constructor(private deps: ListInstitutionalPlansDeps) {}

  async execute(
    input?: ListInstitutionalPlansInput,
  ): Promise<InstitutionalPlanResponseDTO[]> {
    const plans = await this.deps.institutionalPlanRepository.findMany({
      where: input?.filters,
      pagination: input?.pagination,
    })

    return InstitutionalPlanMapper.toDTOList(plans)
  }
}
