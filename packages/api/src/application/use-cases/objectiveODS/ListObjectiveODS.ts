import type { IUseCase } from '@sigep/shared'
import type {
  IObjectiveODSRepository,
  ObjectiveODSFilters,
} from '~/domain/repositories/IObjectiveODSRepository'
import type { ObjectiveODSResponseDTO } from '../../dto/objectiveODS/ObjectiveODSResponseDTO'
import { ObjectiveODSMapper } from '../../mappers/ObjectiveODSMapper'

export interface ListObjectiveODSInput {
  where?: ObjectiveODSFilters
  pagination?: {
    offset?: number
    limit?: number
  }
}

export interface ListObjectiveODSDeps {
  objectiveODSRepository: IObjectiveODSRepository
}

export class ListObjectiveODS
  implements IUseCase<ListObjectiveODSInput, ObjectiveODSResponseDTO[]>
{
  constructor(private deps: ListObjectiveODSDeps) {}

  async execute(
    input: ListObjectiveODSInput,
  ): Promise<ObjectiveODSResponseDTO[]> {
    const objectivesODS = await this.deps.objectiveODSRepository.findMany({
      where: input.where,
      pagination: input.pagination,
    })

    return ObjectiveODSMapper.toDTOList(objectivesODS)
  }
}
