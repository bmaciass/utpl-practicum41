import type { ProjectTaskStatus } from '~/domain/entities/ProjectTask'

export interface CreateProjectTaskDTO {
  name: string
  description: string | null
  projectUid: string
  responsibleUid: string
  status?: ProjectTaskStatus
  startDate?: Date | null
  endDate?: Date | null
}
