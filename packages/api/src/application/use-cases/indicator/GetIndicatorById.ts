import type { IUseCase } from '@sigep/shared'
import type { IIndicatorRepository } from '~/domain/repositories/IIndicatorRepository'
import type { IndicatorResponseDTO } from '../../dto/indicator'
import { IndicatorApplicationMapper } from '../../mappers/IndicatorMapper'

export interface GetIndicatorByIdInput {
  uid: string
}

export interface GetIndicatorByIdDeps {
  indicatorRepository: IIndicatorRepository
}

export class GetIndicatorById
  implements IUseCase<GetIndicatorByIdInput, IndicatorResponseDTO>
{
  constructor(private deps: GetIndicatorByIdDeps) {}

  async execute(input: GetIndicatorByIdInput): Promise<IndicatorResponseDTO> {
    const indicator = await this.deps.indicatorRepository.findByUidOrThrow(
      input.uid,
    )
    return IndicatorApplicationMapper.toDTO(indicator)
  }
}
