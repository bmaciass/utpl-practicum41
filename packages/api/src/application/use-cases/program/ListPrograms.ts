import type { IUseCase } from '@sigep/shared'
import { ProgramMapper } from '~/application/mappers/ProgramMapper'
import type { IInstitutionRepository } from '~/domain/repositories/IInstitutionRepository'
import type {
  IProgramRepository,
  ProgramFilters,
} from '~/domain/repositories/IProgramRepository'
import type { ProgramResponseDTO } from '../../dto/program'

export interface ListProgramsInput {
  where?: ProgramFilters
  institutionUid?: string
  pagination?: {
    offset?: number
    limit?: number
  }
}

export interface ListProgramsDeps {
  institutionRepository: IInstitutionRepository
  programRepository: IProgramRepository
}

export class ListPrograms
  implements IUseCase<ListProgramsInput, ProgramResponseDTO[]>
{
  constructor(private deps: ListProgramsDeps) {}

  async execute(input: ListProgramsInput): Promise<ProgramResponseDTO[]> {
    const institutionId = input.institutionUid
      ? (await this.deps.institutionRepository.findByUidOrThrow(
          input.institutionUid,
        )).id
      : undefined

    const programs = await this.deps.programRepository.findMany({
      where: {
        ...input.where,
        institutionId,
      },
      pagination: input.pagination,
    })

    return ProgramMapper.toDTOList(programs)
  }
}
