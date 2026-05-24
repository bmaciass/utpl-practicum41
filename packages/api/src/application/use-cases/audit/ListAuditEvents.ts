import type { IUseCase } from '@sigep/shared'
import type { IAuditEventRepository } from '~/domain/repositories/IAuditEventRepository'
import type {
  AuditEventListResponseDTO,
  ListAuditEventsDTO,
} from '../../dto/audit'

interface ListAuditEventsDeps {
  auditEventRepository: IAuditEventRepository
}

export class ListAuditEvents
  implements IUseCase<ListAuditEventsDTO, AuditEventListResponseDTO>
{
  constructor(private deps: ListAuditEventsDeps) {}

  async execute(input: ListAuditEventsDTO): Promise<AuditEventListResponseDTO> {
    const [records, total] = await Promise.all([
      this.deps.auditEventRepository.list(input),
      this.deps.auditEventRepository.count(input.filters),
    ])

    return {
      total,
      records,
    }
  }
}
