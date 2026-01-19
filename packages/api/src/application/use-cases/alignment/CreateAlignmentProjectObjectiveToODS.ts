import type { IUseCase } from '@sigep/shared'
import { NotFoundError, ValidationError } from '@sigep/shared'
import { AlignmentProjectObjectiveToODS as AlignmentEntity } from '~/domain/entities/AlignmentProjectObjectiveToODS'
import type { IAlignmentProjectObjectiveToODSRepository } from '~/domain/repositories/IAlignmentProjectObjectiveToODSRepository'
import type { IObjectiveODSRepository } from '~/domain/repositories/IObjectiveODSRepository'
import type { IProjectObjectiveRepository } from '~/domain/repositories/IProjectObjectiveRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import { AlignmentMapper } from '../../mappers/AlignmentMapper'
import type {
  AlignmentProjectObjectiveToODSResponseDTO,
  CreateAlignmentProjectObjectiveToODSDTO,
} from '../../dto/alignment'

export interface CreateAlignmentProjectObjectiveToODSDeps {
  alignmentRepository: IAlignmentProjectObjectiveToODSRepository
  projectObjectiveRepository: IProjectObjectiveRepository
  odsObjectiveRepository: IObjectiveODSRepository
  userRepository: IUserRepository
}

export class CreateAlignmentProjectObjectiveToODS
  implements
    IUseCase<
      CreateAlignmentProjectObjectiveToODSDTO,
      AlignmentProjectObjectiveToODSResponseDTO
    >
{
  constructor(private deps: CreateAlignmentProjectObjectiveToODSDeps) {}

  async execute(
    input: CreateAlignmentProjectObjectiveToODSDTO,
    userUid: string,
  ): Promise<AlignmentProjectObjectiveToODSResponseDTO> {
    const user = await this.deps.userRepository.findByUid(userUid)
    if (!user) {
      throw new NotFoundError('user', userUid)
    }

    const [projectObjective, ods] = await Promise.all([
      this.deps.projectObjectiveRepository.findByUidOrThrow(
        input.projectObjectiveUid,
      ),
      this.deps.odsObjectiveRepository.findByUidOrThrow(input.odsObjectiveUid),
    ])

    if (!projectObjective.active) {
      throw new ValidationError(
        'No se puede alinear un objetivo de proyecto inactivo',
        'projectObjectiveUid',
      )
    }
    if (!ods.active) {
      throw new ValidationError(
        'No se puede alinear con un objetivo ODS inactivo',
        'odsObjectiveUid',
      )
    }

    const exists = await this.deps.alignmentRepository.existsByObjectivePair(
      projectObjective.id,
      ods.id,
    )
    if (exists) {
      throw new ValidationError('Esta alineación ya existe', 'alignment')
    }

    const alignment = AlignmentEntity.create({
      projectObjectiveId: projectObjective.id,
      odsObjectiveId: ods.id,
      createdBy: user.id,
    })

    await this.deps.alignmentRepository.save(alignment)

    return AlignmentMapper.toProjectObjectiveToODSDTO(
      alignment,
      projectObjective,
      ods,
    )
  }
}
