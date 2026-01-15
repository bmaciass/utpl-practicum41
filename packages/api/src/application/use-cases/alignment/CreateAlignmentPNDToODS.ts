import type { IUseCase } from '@sigep/shared'
import { NotFoundError, ValidationError } from '@sigep/shared'
import { AlignmentPNDToODS as AlignmentEntity } from '~/domain/entities/AlignmentPNDToODS'
import type { IAlignmentPNDToODSRepository } from '~/domain/repositories/IAlignmentPNDToODSRepository'
import type { IObjectiveODSRepository } from '~/domain/repositories/IObjectiveODSRepository'
import type { IObjectivePNDRepository } from '~/domain/repositories/IObjectivePNDRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import { AlignmentMapper } from '../../mappers/AlignmentMapper'
import type {
  AlignmentPNDToODSResponseDTO,
  CreateAlignmentPNDToODSDTO,
} from '../../dto/alignment'

export interface CreateAlignmentPNDToODSDeps {
  alignmentRepository: IAlignmentPNDToODSRepository
  pndObjectiveRepository: IObjectivePNDRepository
  odsObjectiveRepository: IObjectiveODSRepository
  userRepository: IUserRepository
}

export class CreateAlignmentPNDToODS
  implements IUseCase<CreateAlignmentPNDToODSDTO, AlignmentPNDToODSResponseDTO>
{
  constructor(private deps: CreateAlignmentPNDToODSDeps) {}

  async execute(
    input: CreateAlignmentPNDToODSDTO,
    userUid: string,
  ): Promise<AlignmentPNDToODSResponseDTO> {
    // 1. Resolve user for audit trail
    const user = await this.deps.userRepository.findByUid(userUid)
    if (!user) {
      throw new NotFoundError('user', userUid)
    }

    // 2. Resolve both objectives
    const [pnd, ods] = await Promise.all([
      this.deps.pndObjectiveRepository.findByUidOrThrow(input.pndObjectiveUid),
      this.deps.odsObjectiveRepository.findByUidOrThrow(input.odsObjectiveUid),
    ])

    // 3. Validate both objectives are active
    if (!pnd.active) {
      throw new ValidationError(
        'No se puede alinear un objetivo PND inactivo',
        'pndObjectiveUid',
      )
    }
    if (!ods.active) {
      throw new ValidationError(
        'No se puede alinear con un objetivo ODS inactivo',
        'odsObjectiveUid',
      )
    }

    // 4. Check for duplicate alignment
    const exists = await this.deps.alignmentRepository.existsByObjectivePair(
      pnd.id,
      ods.id,
    )
    if (exists) {
      throw new ValidationError('Esta alineación ya existe', 'alignment')
    }

    // 5. Create alignment entity
    const alignment = AlignmentEntity.create({
      pndObjectiveId: pnd.id,
      odsObjectiveId: ods.id,
      createdBy: user.id,
    })

    // 6. Persist
    await this.deps.alignmentRepository.save(alignment)

    // 7. Return DTO with objective details
    return AlignmentMapper.toPNDToODSDTO(alignment, pnd, ods)
  }
}
