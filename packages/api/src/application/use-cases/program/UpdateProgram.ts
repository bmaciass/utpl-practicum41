import type { IUseCase } from '@sigep/shared'
import type { IProgramRepository } from '~/domain/repositories/IProgramRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { ProgramResponseDTO, UpdateProgramDTO } from '../../dto/program'
import { ProgramMapper } from '../../mappers/ProgramMapper'

export interface UpdateProgramInput {
  uid: string
  data: UpdateProgramDTO
}

export interface UpdateProgramDeps {
  programRepository: IProgramRepository
  userRepository: IUserRepository
}

export class UpdateProgram
  implements IUseCase<UpdateProgramInput, ProgramResponseDTO>
{
  constructor(private deps: UpdateProgramDeps) {}

  async execute(
    input: UpdateProgramInput,
    userUid: string,
  ): Promise<ProgramResponseDTO> {
    const [program, user] = await Promise.all([
      this.deps.programRepository.findByUidOrThrow(input.uid),
      this.deps.userRepository.findByUidOrThrow(userUid),
    ])
    const updatedBy = user.id

    if (input.data.name !== undefined) {
      program.updateName(input.data.name, updatedBy)
    }
    if (input.data.description !== undefined) {
      program.updateDescription({
        description: input.data.description,
        updatedBy,
      })
    }
    if (
      input.data.startDate !== undefined ||
      input.data.endDate !== undefined
    ) {
      program.updateDates(
        {
          startDate: input.data.startDate,
          endDate: input.data.endDate,
        },
        updatedBy,
      )
    }
    if (input.data.estimatedInversion !== undefined) {
      program.updateEstimatedInversion({
        estimatedInversion: input.data.estimatedInversion,
        updatedBy,
      })
    }
    if (input.data.responsibleUid !== undefined) {
      const user = await this.deps.userRepository.findByUid(
        input.data.responsibleUid,
      )
      if (user) {
        program.updateResponsible(user.id, updatedBy)
      }
    }
    if (input.data.active !== undefined) {
      if (input.data.active) {
        program.activate(updatedBy)
      } else {
        program.deactivate(updatedBy)
      }
    }

    await this.deps.programRepository.save(program)

    return ProgramMapper.toDTO(program)
  }
}
