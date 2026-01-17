import type { IUseCase } from '@sigep/shared'
import type {
  FindManyIndicatorsOptions,
  IIndicatorRepository,
} from '~/domain/repositories/IIndicatorRepository'
import type { IndicatorResponseDTO } from '../../dto/indicator'
import { IndicatorApplicationMapper } from '../../mappers/IndicatorMapper'

export interface ListIndicatorsInput {
  options?: FindManyIndicatorsOptions
}

export interface ListIndicatorsDeps {
  indicatorRepository: IIndicatorRepository
}

export class ListIndicators
  implements IUseCase<ListIndicatorsInput, IndicatorResponseDTO[]>
{
  constructor(private deps: ListIndicatorsDeps) {}

  async execute(input: ListIndicatorsInput): Promise<IndicatorResponseDTO[]> {
    const indicators = await this.deps.indicatorRepository.findMany(
      input.options,
    )
    return indicators.map(IndicatorApplicationMapper.toDTO)
  }
}
