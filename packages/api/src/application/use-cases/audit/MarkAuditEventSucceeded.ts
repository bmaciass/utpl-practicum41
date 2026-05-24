import type { IUseCase } from '@sigep/shared'
import type { IAuditEventRepository } from '~/domain/repositories/IAuditEventRepository'
import type {
  AuditEventResponseDTO,
  MarkAuditEventSucceededDTO,
} from '../../dto/audit'

interface MarkAuditEventSucceededDeps {
  auditEventRepository: IAuditEventRepository
}

export class MarkAuditEventSucceeded
  implements IUseCase<MarkAuditEventSucceededDTO, AuditEventResponseDTO>
{
  constructor(private deps: MarkAuditEventSucceededDeps) {}

  execute(input: MarkAuditEventSucceededDTO): Promise<AuditEventResponseDTO> {
    return this.deps.auditEventRepository.markSucceeded(input)
  }
}
