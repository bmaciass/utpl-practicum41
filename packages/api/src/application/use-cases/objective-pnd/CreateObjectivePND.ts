import { type IUseCase, NotFoundError } from '@sigep/shared'
import { ObjectivePND } from '~/domain/entities/ObjectivePND'
import type { IObjectivePNDRepository } from '~/domain/repositories/IObjectivePNDRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  CreateObjectivePNDDTO,
  ObjectivePNDResponseDTO,
} from '../../dto/objective-pnd'
import { ObjectivePNDMapper } from '../../mappers/ObjectivePNDMapper'

export interface CreateObjectivePNDDeps {
  objectivePNDRepository: IObjectivePNDRepository
  userRepository: IUserRepository
}

export class CreateObjectivePND
  implements IUseCase<CreateObjectivePNDDTO, ObjectivePNDResponseDTO>
{
  constructor(private deps: CreateObjectivePNDDeps) {}

  async execute(
    input: CreateObjectivePNDDTO,
    userUid: string,
  ): Promise<ObjectivePNDResponseDTO> {
    const user = await this.deps.userRepository.findByUid(userUid)

    if (!user) throw new NotFoundError('user', userUid)

    const objective = ObjectivePND.create({
      name: input.name,
      description: input.description,
      createdBy: user.id,
    })

    await this.deps.objectivePNDRepository.save(objective)

    return ObjectivePNDMapper.toDTO(objective)
  }
}
