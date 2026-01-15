import type { IUseCase } from '@sigep/shared'
import type { IObjectivePNDRepository } from '~/domain/repositories/IObjectivePNDRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  ObjectivePNDResponseDTO,
  UpdateObjectivePNDDTO,
} from '../../dto/objective-pnd'
import { ObjectivePNDMapper } from '../../mappers/ObjectivePNDMapper'

export interface UpdateObjectivePNDInput {
  uid: string
  data: UpdateObjectivePNDDTO
}

export interface UpdateObjectivePNDDeps {
  objectivePNDRepository: IObjectivePNDRepository
  userRepository: IUserRepository
}

export class UpdateObjectivePND
  implements IUseCase<UpdateObjectivePNDInput, ObjectivePNDResponseDTO>
{
  constructor(private deps: UpdateObjectivePNDDeps) {}

  async execute(
    input: UpdateObjectivePNDInput,
    userUid: string,
  ): Promise<ObjectivePNDResponseDTO> {
    const [objective, user] = await Promise.all([
      this.deps.objectivePNDRepository.findByUidOrThrow(input.uid),
      this.deps.userRepository.findByUidOrThrow(userUid),
    ])
    const updatedBy = user.id

    if (input.data.name !== undefined) {
      objective.updateName(input.data.name, updatedBy)
    }
    if (input.data.description !== undefined) {
      objective.updateDescription(input.data.description, updatedBy)
    }
    if (input.data.active !== undefined) {
      if (input.data.active) {
        objective.activate(updatedBy)
      } else {
        objective.deactivate(updatedBy)
      }
    }

    await this.deps.objectivePNDRepository.save(objective)

    return ObjectivePNDMapper.toDTO(objective)
  }
}
