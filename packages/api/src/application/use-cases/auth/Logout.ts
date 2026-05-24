import type { IPublicUseCase } from '@sigep/shared'
import type { IAuthSessionRepository } from '~/domain/repositories/IAuthSessionRepository'
import type { IJWTService } from '~/domain/services/IJWTService'
import { getDefaultJWTService } from '~/infrastructure/services/JWTService'

export interface LogoutUseCaseInputDTO {
  refreshToken: string
}

export interface LogoutUseCaseDeps {
  authSessionRepository: IAuthSessionRepository
  jwtService?: IJWTService
}

export class LogoutUseCase
  implements IPublicUseCase<LogoutUseCaseInputDTO, boolean>
{
  constructor(private deps: LogoutUseCaseDeps) {}

  async execute(input: LogoutUseCaseInputDTO): Promise<boolean> {
    const jwtService = this.deps.jwtService ?? (await getDefaultJWTService())
    const payload = await jwtService.verifyRefreshToken(input.refreshToken)

    if (!payload?.sessionId) {
      return false
    }

    await this.deps.authSessionRepository.revoke(payload.sessionId)
    return true
  }
}
