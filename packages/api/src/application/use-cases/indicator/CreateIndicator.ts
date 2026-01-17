import type { IUseCase } from '@sigep/shared'
import { NotFoundError } from '@sigep/shared'
import { Indicator } from '~/domain/entities/Indicator'
import type { IGoalRepository } from '~/domain/repositories/IGoalRepository'
import type { IIndicatorRepository } from '~/domain/repositories/IIndicatorRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  CreateIndicatorDTO,
  IndicatorResponseDTO,
} from '../../dto/indicator'
import { IndicatorApplicationMapper } from '../../mappers/IndicatorMapper'

export interface CreateIndicatorDeps {
  indicatorRepository: IIndicatorRepository
  goalRepository: IGoalRepository
  userRepository: IUserRepository
}

export class CreateIndicator
  implements IUseCase<CreateIndicatorDTO, IndicatorResponseDTO>
{
  constructor(private deps: CreateIndicatorDeps) {}

  async execute(
    input: CreateIndicatorDTO,
    userUid: string,
  ): Promise<IndicatorResponseDTO> {
    const [goal, user] = await Promise.all([
      this.deps.goalRepository.findByUid(input.goalUid),
      this.deps.userRepository.findByUid(userUid),
    ])

    if (!goal) {
      throw new NotFoundError('goal', input.goalUid)
    }
    if (!user) {
      throw new NotFoundError('user', userUid)
    }

    const indicator = Indicator.create({
      name: input.name,
      description: input.description ?? null,
      type: input.type ?? null,
      unitType: input.unitType ?? null,
      minValue: input.minValue ?? null,
      maxValue: input.maxValue ?? null,
      goalId: goal.id,
      createdBy: user.id,
    })

    const savedIndicator = await this.deps.indicatorRepository.save(indicator)

    return IndicatorApplicationMapper.toDTO(savedIndicator)
  }
}
