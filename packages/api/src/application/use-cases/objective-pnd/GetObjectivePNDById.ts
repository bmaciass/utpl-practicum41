import type { IUseCase } from '@sigep/shared'
import type { IObjectivePNDRepository } from '~/domain/repositories/IObjectivePNDRepository'
import type { ObjectivePNDResponseDTO } from '../../dto/objective-pnd'
import { ObjectivePNDMapper } from '../../mappers/ObjectivePNDMapper'

export interface GetObjectivePNDByIdDeps {
  objectivePNDRepository: IObjectivePNDRepository
}

export class GetObjectivePNDById
  implements IUseCase<string, ObjectivePNDResponseDTO>
{
  constructor(private deps: GetObjectivePNDByIdDeps) {}

  async execute(uid: string): Promise<ObjectivePNDResponseDTO> {
    const objective =
      await this.deps.objectivePNDRepository.findByUidOrThrow(uid)

    return ObjectivePNDMapper.toDTO(objective)
  }
}
