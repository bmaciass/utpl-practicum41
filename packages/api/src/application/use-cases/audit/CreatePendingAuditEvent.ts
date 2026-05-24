import type { IUseCase } from '@sigep/shared'
import type { IAuditEventRepository } from '~/domain/repositories/IAuditEventRepository'
import type {
  AuditEventResponseDTO,
  CreatePendingAuditEventDTO,
} from '../../dto/audit'

interface CreatePendingAuditEventDeps {
  auditEventRepository: IAuditEventRepository
}

export class CreatePendingAuditEvent
  implements IUseCase<CreatePendingAuditEventDTO, AuditEventResponseDTO>
{
  constructor(private deps: CreatePendingAuditEventDeps) {}

  execute(input: CreatePendingAuditEventDTO): Promise<AuditEventResponseDTO> {
    return this.deps.auditEventRepository.createPending(input)
  }
}
