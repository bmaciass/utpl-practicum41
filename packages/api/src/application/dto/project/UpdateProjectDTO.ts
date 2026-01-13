import type { ProjectStatus } from '~/domain/entities/Project'

export interface UpdateProjectDTO {
  name?: string
  description?: string
  status?: ProjectStatus
  startDate?: Date
  endDate?: Date
  responsibleUid?: string
  active?: boolean
}
