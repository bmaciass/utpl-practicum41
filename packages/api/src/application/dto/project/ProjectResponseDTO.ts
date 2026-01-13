import type { ProjectStatus } from '~/domain/entities/Project'

export interface ProjectResponseDTO {
  id: number
  uid: string
  name: string
  description: string | null
  status: ProjectStatus
  startDate: Date | null
  endDate: Date | null
  responsibleId: number
  programId: number
  // responsibleUid: string
  // programUid: string
  active: boolean
  deletedAt: Date | null
}
