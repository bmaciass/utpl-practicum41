import type { IUseCase } from '@sigep/shared'
import type {
  FindManyObjectivePNDOptions,
  IObjectivePNDRepository,
} from '~/domain/repositories/IObjectivePNDRepository'
import type { ObjectivePNDResponseDTO } from '../../dto/objective-pnd'
import { ObjectivePNDMapper } from '../../mappers/ObjectivePNDMapper'

export interface ListObjectivePNDDeps {
  objectivePNDRepository: IObjectivePNDRepository
}

export class ListObjectivePND
  implements IUseCase<FindManyObjectivePNDOptions, ObjectivePNDResponseDTO[]>
{
  constructor(private deps: ListObjectivePNDDeps) {}

  async execute(
    input: FindManyObjectivePNDOptions,
  ): Promise<ObjectivePNDResponseDTO[]> {
    const objectives = await this.deps.objectivePNDRepository.findMany(input)

    return ObjectivePNDMapper.toDTOList(objectives)
  }
}
