import { type IUseCase, NotFoundError } from '@sigep/shared'
import { ProgramMapper } from '~/application/mappers/ProgramMapper'
import type { IProgramRepository } from '~/domain/repositories/IProgramRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { ProgramResponseDTO } from '../../dto/program'

export interface GetProgramByIdDeps {
  programRepository: IProgramRepository
  userRepository: IUserRepository
}

export class GetProgramById
  implements IUseCase<string, ProgramResponseDTO | null>
{
  constructor(private deps: GetProgramByIdDeps) {}

  async execute(uid: string): Promise<ProgramResponseDTO | null> {
    const program = await this.deps.programRepository.findByUid(uid)
    if (!program) return null

    // Fetch responsible user to get the uid
    const responsibleUser = await this.deps.userRepository.findById(
      program.responsibleId,
    )
    if (!responsibleUser) {
      throw NotFoundError.forEntity('User', String(program.responsibleId))
    }

    return ProgramMapper.toDTO(program)
  }
}
