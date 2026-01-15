import type { ProjectTaskStatus } from '~/domain/entities/ProjectTask'

export interface UpdateProjectTaskDTO {
  name?: string
  description?: string | null
  responsibleUid?: string
  status?: ProjectTaskStatus
  startDate?: Date
  endDate?: Date
  active?: boolean
}
