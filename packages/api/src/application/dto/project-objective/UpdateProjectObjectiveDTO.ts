import type { ProjectObjectiveStatus } from '~/domain/entities/ProjectObjective'

export interface UpdateProjectObjectiveDTO {
  name?: string
  status?: ProjectObjectiveStatus
  active?: boolean
}
