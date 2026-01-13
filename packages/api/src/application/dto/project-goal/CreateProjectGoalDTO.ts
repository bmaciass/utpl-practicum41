import type { ProjectGoalStatus } from '~/domain/entities/ProjectGoal'

export interface CreateProjectGoalDTO {
  name: string
  projectUid: string
  status?: ProjectGoalStatus
  startDate?: Date | null
  endDate?: Date | null
}
