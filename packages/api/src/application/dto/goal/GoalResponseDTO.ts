export interface GoalResponseDTO {
  uid: string
  name: string
  description: string
  institutionalObjectiveId: number
  active: boolean
  createdAt: Date
  createdBy: number
  updatedAt: Date | null
  updatedBy: number | null
  deletedAt: Date | null
}
