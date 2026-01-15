import type { ProjectTaskStatus } from '~/domain/entities/ProjectTask'

export interface ProjectTaskResponseDTO {
  uid: string
  name: string
  description: string | null
  projectId: number
  responsibleId: number
  status: ProjectTaskStatus
  startDate: Date | null
  endDate: Date | null
  active: boolean
  deletedAt: Date | null
}
