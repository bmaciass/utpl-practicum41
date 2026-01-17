import type { IUseCase } from '@sigep/shared'
import { NotFoundError } from '@sigep/shared'
import type { IGoalRepository } from '~/domain/repositories/IGoalRepository'
import type { IIndicatorRepository } from '~/domain/repositories/IIndicatorRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  IndicatorResponseDTO,
  UpdateIndicatorDTO,
} from '../../dto/indicator'
import { IndicatorApplicationMapper } from '../../mappers/IndicatorMapper'

export interface UpdateIndicatorInput {
  uid: string
  data: UpdateIndicatorDTO
}

export interface UpdateIndicatorDeps {
  indicatorRepository: IIndicatorRepository
  goalRepository: IGoalRepository
  userRepository: IUserRepository
}

export class UpdateIndicator
  implements IUseCase<UpdateIndicatorInput, IndicatorResponseDTO>
{
  constructor(private deps: UpdateIndicatorDeps) {}

  async execute(
    input: UpdateIndicatorInput,
    userUid: string,
  ): Promise<IndicatorResponseDTO> {
    const indicator = await this.deps.indicatorRepository.findByUidOrThrow(
      input.uid,
    )

    const user = await this.deps.userRepository.findByUid(userUid)
    if (!user) {
      throw new NotFoundError('user', userUid)
    }

    if (input.data.name !== undefined) {
      indicator.updateName(input.data.name, user.id)
    }

    if (input.data.description !== undefined) {
      indicator.updateDescription(input.data.description ?? null, user.id)
    }

    if (input.data.type !== undefined) {
      indicator.updateType(input.data.type ?? null, user.id)
    }

    if (input.data.unitType !== undefined) {
      indicator.updateUnitType(input.data.unitType ?? null, user.id)
    }

    if (
      input.data.minValue !== undefined ||
      input.data.maxValue !== undefined
    ) {
      indicator.updateRange(
        {
          minValue: input.data.minValue,
          maxValue: input.data.maxValue,
        },
        user.id,
      )
    }

    if (input.data.goalUid !== undefined) {
      const goal = await this.deps.goalRepository.findByUidOrThrow(
        input.data.goalUid,
      )
      indicator.updateGoal(goal.id, user.id)
    }

    if (input.data.active === false && indicator.active) {
      indicator.deactivate(user.id)
    }

    const savedIndicator = await this.deps.indicatorRepository.save(indicator)

    return IndicatorApplicationMapper.toDTO(savedIndicator)
  }
}
