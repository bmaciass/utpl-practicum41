import type { IUseCase } from '@sigep/shared'
import { ProgramMapper } from '~/application/mappers/ProgramMapper'
import type {
  IProgramRepository,
  ProgramFilters,
} from '~/domain/repositories/IProgramRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { ProgramResponseDTO } from '../../dto/program'

export interface ListProgramsInput {
  where?: ProgramFilters
  pagination?: {
    offset?: number
    limit?: number
  }
}

export interface ListProgramsDeps {
  programRepository: IProgramRepository
  userRepository: IUserRepository
}

export class ListPrograms
  implements IUseCase<ListProgramsInput, ProgramResponseDTO[]>
{
  constructor(private deps: ListProgramsDeps) {}

  async execute(input: ListProgramsInput): Promise<ProgramResponseDTO[]> {
    const programs = await this.deps.programRepository.findMany({
      where: input.where,
      pagination: input.pagination,
    })

    return ProgramMapper.toDTOList(programs)
  }
}
