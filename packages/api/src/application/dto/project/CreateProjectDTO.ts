import type { ProjectStatus } from '~/domain/entities/Project'

export interface CreateProjectDTO {
  name: string
  description?: string | null
  status?: ProjectStatus
  startDate?: Date | null
  endDate?: Date | null
  responsibleUid: string
  programUid: string
}
