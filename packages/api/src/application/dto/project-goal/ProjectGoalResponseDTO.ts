import type { ProjectGoalStatus } from '~/domain/entities/ProjectGoal'

export interface ProjectGoalResponseDTO {
  uid: string
  name: string
  projectId: number
  status: ProjectGoalStatus
  startDate: Date | null
  endDate: Date | null
  active: boolean
  deletedAt: Date | null
}
