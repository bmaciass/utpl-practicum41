import type { PaginationOptions } from '@sigep/shared'
import type {
  IInstitutionRepository,
  InstitutionFilters,
} from '~/domain/repositories/IInstitutionRepository'
import type { InstitutionResponseDTO } from '../../dto/institution'
import { InstitutionMapper } from '../../mappers/InstitutionMapper'

export interface ListInstitutionsInput {
  filters?: InstitutionFilters
  pagination?: PaginationOptions
}

export interface ListInstitutionsDeps {
  institutionRepository: IInstitutionRepository
}

export class ListInstitutions {
  constructor(private deps: ListInstitutionsDeps) {}

  async execute(
    input?: ListInstitutionsInput,
  ): Promise<InstitutionResponseDTO[]> {
    const institutions = await this.deps.institutionRepository.findMany({
      where: input?.filters,
      pagination: input?.pagination,
    })

    return InstitutionMapper.toDTOList(institutions)
  }
}
