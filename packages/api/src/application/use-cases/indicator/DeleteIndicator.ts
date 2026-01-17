import type { IUseCase } from '@sigep/shared'
import { NotFoundError } from '@sigep/shared'
import type { IIndicatorRepository } from '~/domain/repositories/IIndicatorRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'

export interface DeleteIndicatorInput {
  uid: string
}

export interface DeleteIndicatorDeps {
  indicatorRepository: IIndicatorRepository
  userRepository: IUserRepository
}

export class DeleteIndicator implements IUseCase<DeleteIndicatorInput, void> {
  constructor(private deps: DeleteIndicatorDeps) {}

  async execute(input: DeleteIndicatorInput, userUid: string): Promise<void> {
    const indicator = await this.deps.indicatorRepository.findByUidOrThrow(
      input.uid,
    )

    const user = await this.deps.userRepository.findByUid(userUid)
    if (!user) {
      throw new NotFoundError('user', userUid)
    }

    indicator.deactivate(user.id)
    await this.deps.indicatorRepository.save(indicator)
  }
}
