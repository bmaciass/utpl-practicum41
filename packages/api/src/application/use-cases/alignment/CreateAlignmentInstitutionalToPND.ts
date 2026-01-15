import type { IUseCase } from '@sigep/shared'
import { NotFoundError, ValidationError } from '@sigep/shared'
import type { AlignmentInstitutionalToPND } from '~/domain/entities/AlignmentInstitutionalToPND'
import type { IAlignmentInstitutionalToPNDRepository } from '~/domain/repositories/IAlignmentInstitutionalToPNDRepository'
import type { IInstitutionalObjectiveRepository } from '~/domain/repositories/IInstitutionalObjectiveRepository'
import type { IObjectivePNDRepository } from '~/domain/repositories/IObjectivePNDRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import { AlignmentInstitutionalToPND as AlignmentEntity } from '~/domain/entities/AlignmentInstitutionalToPND'
import { AlignmentMapper } from '../../mappers/AlignmentMapper'
import type {
  AlignmentInstitutionalToPNDResponseDTO,
  CreateAlignmentInstitutionalToPNDDTO,
} from '../../dto/alignment'

export interface CreateAlignmentInstitutionalToPNDDeps {
  alignmentRepository: IAlignmentInstitutionalToPNDRepository
  institutionalObjectiveRepository: IInstitutionalObjectiveRepository
  pndObjectiveRepository: IObjectivePNDRepository
  userRepository: IUserRepository
}

export class CreateAlignmentInstitutionalToPND
  implements
    IUseCase<
      CreateAlignmentInstitutionalToPNDDTO,
      AlignmentInstitutionalToPNDResponseDTO
    >
{
  constructor(private deps: CreateAlignmentInstitutionalToPNDDeps) {}

  async execute(
    input: CreateAlignmentInstitutionalToPNDDTO,
    userUid: string,
  ): Promise<AlignmentInstitutionalToPNDResponseDTO> {
    // 1. Resolve user for audit trail
    const user = await this.deps.userRepository.findByUid(userUid)
    if (!user) {
      throw new NotFoundError('user', userUid)
    }

    // 2. Resolve both objectives
    const [institutional, pnd] = await Promise.all([
      this.deps.institutionalObjectiveRepository.findByUidOrThrow(
        input.institutionalObjectiveUid,
      ),
      this.deps.pndObjectiveRepository.findByUidOrThrow(input.pndObjectiveUid),
    ])

    // 3. Validate both objectives are active
    if (!institutional.active) {
      throw new ValidationError(
        'No se puede alinear un objetivo institucional inactivo',
        'institutionalObjectiveUid',
      )
    }
    if (!pnd.active) {
      throw new ValidationError(
        'No se puede alinear con un objetivo PND inactivo',
        'pndObjectiveUid',
      )
    }

    // 4. Check for duplicate alignment
    const exists = await this.deps.alignmentRepository.existsByObjectivePair(
      institutional.id,
      pnd.id,
    )
    if (exists) {
      throw new ValidationError('Esta alineación ya existe', 'alignment')
    }

    // 5. Create alignment entity
    const alignment = AlignmentEntity.create({
      institutionalObjectiveId: institutional.id,
      pndObjectiveId: pnd.id,
      createdBy: user.id,
    })

    // 6. Persist
    await this.deps.alignmentRepository.save(alignment)

    // 7. Return DTO with objective details
    return AlignmentMapper.toInstitutionalToPNDDTO(
      alignment,
      institutional,
      pnd,
    )
  }
}
