import type { IUseCase } from '@sigep/shared'
import type { IAuditEventRepository } from '~/domain/repositories/IAuditEventRepository'
import type {
  AuditEventResponseDTO,
  MarkAuditEventFailedDTO,
} from '../../dto/audit'

interface MarkAuditEventFailedDeps {
  auditEventRepository: IAuditEventRepository
}

export class MarkAuditEventFailed
  implements IUseCase<MarkAuditEventFailedDTO, AuditEventResponseDTO>
{
  constructor(private deps: MarkAuditEventFailedDeps) {}

  execute(input: MarkAuditEventFailedDTO): Promise<AuditEventResponseDTO> {
    return this.deps.auditEventRepository.markFailed(input)
  }
}
