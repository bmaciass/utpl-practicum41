import type { IUseCase } from '@sigep/shared'
import { ProgramMapper } from '~/application/mappers/ProgramMapper'
import { Program } from '~/domain/entities/Program'
import type { IProgramRepository } from '~/domain/repositories/IProgramRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { CreateProgramDTO, ProgramResponseDTO } from '../../dto/program'

export interface CreateProgramDeps {
  programRepository: IProgramRepository
  userRepository: IUserRepository
}

export class CreateProgram
  implements IUseCase<CreateProgramDTO, ProgramResponseDTO>
{
  constructor(private deps: CreateProgramDeps) {}

  async execute(
    input: CreateProgramDTO,
    actorId: string,
  ): Promise<ProgramResponseDTO> {
    // Fetch responsible user to get the database ID
    const responsibleUser = await this.deps.userRepository.findByUidOrThrow(
      input.responsibleUid,
    )

    const program = Program.create({
      name: input.name,
      description: input.description,
      startDate: input.startDate,
      endDate: input.endDate,
      responsibleId: responsibleUser.id,
      createdBy: Number(actorId),
    })

    await this.deps.programRepository.save(program)

    return ProgramMapper.toDTO(program)
  }
}
