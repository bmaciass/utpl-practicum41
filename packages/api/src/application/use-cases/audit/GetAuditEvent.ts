import { NotFoundError, type IUseCase } from '@sigep/shared'
import type { IAuditEventRepository } from '~/domain/repositories/IAuditEventRepository'
import type { AuditEventResponseDTO, GetAuditEventDTO } from '../../dto/audit'

interface GetAuditEventDeps {
  auditEventRepository: IAuditEventRepository
}

export class GetAuditEvent
  implements IUseCase<GetAuditEventDTO, AuditEventResponseDTO>
{
  constructor(private deps: GetAuditEventDeps) {}

  async execute(input: GetAuditEventDTO): Promise<AuditEventResponseDTO> {
    const auditEvent = await this.deps.auditEventRepository.findByUid(input.uid)

    if (!auditEvent) {
      throw new NotFoundError('audit_event', input.uid)
    }

    return auditEvent
  }
}
