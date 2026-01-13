import type { ProjectGoalStatus } from '~/domain/entities/ProjectGoal'

export interface UpdateProjectGoalDTO {
  name?: string
  status?: ProjectGoalStatus
  startDate?: Date
  endDate?: Date
  active?: boolean
}
