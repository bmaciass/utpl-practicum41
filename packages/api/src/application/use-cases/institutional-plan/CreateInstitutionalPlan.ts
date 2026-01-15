import { type IUseCase, NotFoundError } from '@sigep/shared'
import { InstitutionalPlan } from '~/domain/entities/InstitutionalPlan'
import type { IInstitutionRepository } from '~/domain/repositories/IInstitutionRepository'
import type { IInstitutionalPlanRepository } from '~/domain/repositories/IInstitutionalPlanRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  CreateInstitutionalPlanDTO,
  InstitutionalPlanResponseDTO,
} from '../../dto/institutional-plan'
import { InstitutionalPlanMapper } from '../../mappers/InstitutionalPlanMapper'

export interface CreateInstitutionalPlanDeps {
  institutionRepository: IInstitutionRepository
  institutionalPlanRepository: IInstitutionalPlanRepository
  userRepository: IUserRepository
}

export class CreateInstitutionalPlan
  implements IUseCase<CreateInstitutionalPlanDTO, InstitutionalPlanResponseDTO>
{
  constructor(private deps: CreateInstitutionalPlanDeps) {}

  async execute(
    input: CreateInstitutionalPlanDTO,
    userUid: string,
  ): Promise<InstitutionalPlanResponseDTO> {
    const [institution, user] = await Promise.all([
      this.deps.institutionRepository.findByUid(input.institutionUid),
      this.deps.userRepository.findByUid(userUid),
    ])

    if (!institution)
      throw new NotFoundError('institution', input.institutionUid)
    if (!user) throw new NotFoundError('user', userUid)

    const plan = InstitutionalPlan.create({
      name: input.name,
      year: input.year,
      url: input.url,
      institutionId: institution.id,
      createdBy: user.id,
    })

    await this.deps.institutionalPlanRepository.save(plan)

    return InstitutionalPlanMapper.toDTO(plan)
  }
}
