import type { ProjectObjectiveStatus } from '~/domain/entities/ProjectObjective'

export interface ProjectObjectiveResponseDTO {
  id: number
  uid: string
  name: string
  status: ProjectObjectiveStatus
  projectId: number
  active: boolean
  deletedAt: Date | null
}
