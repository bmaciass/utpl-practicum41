import type { ProjectObjectiveStatus } from '~/domain/entities/ProjectObjective'

export interface CreateProjectObjectiveDTO {
  name: string
  status?: ProjectObjectiveStatus
  projectUid: string
}
