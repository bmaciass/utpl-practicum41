import { NotFoundError, type PaginationOptions } from '@sigep/shared'
import type { IInstitutionRepository } from '~/domain/repositories/IInstitutionRepository'
import type {
  IInstitutionalPlanRepository,
  InstitutionalPlanFilters,
} from '~/domain/repositories/IInstitutionalPlanRepository'
import type { InstitutionalPlanResponseDTO } from '../../dto/institutional-plan'
import { InstitutionalPlanMapper } from '../../mappers/InstitutionalPlanMapper'

export interface ListInstitutionalPlansInput {
  institutionUid: string
  filters?: InstitutionalPlanFilters
  pagination?: PaginationOptions
}

export interface ListInstitutionalPlansDeps {
  institutionRepository: IInstitutionRepository
  institutionalPlanRepository: IInstitutionalPlanRepository
}

export class ListInstitutionalPlans {
  constructor(private deps: ListInstitutionalPlansDeps) {}

  async execute(
    input: ListInstitutionalPlansInput,
  ): Promise<InstitutionalPlanResponseDTO[]> {
    const { institutionUid, filters, pagination } = input

    const institution =
      await this.deps.institutionRepository.findByUid(institutionUid)
    if (!institution)
      throw new NotFoundError('institution', institutionUid, 'uid')

    const where = {
      institutionId: institution.id,
      ...filters,
    } satisfies InstitutionalPlanFilters
    const plans = await this.deps.institutionalPlanRepository.findMany({
      where,
      pagination,
    })

    return InstitutionalPlanMapper.toDTOList(plans)
  }
}
