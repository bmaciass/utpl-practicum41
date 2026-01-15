export interface InstitutionalObjectiveResponseDTO {
  id: number
  uid: string
  name: string
  description: string
  institutionId: number
  active: boolean
  deletedAt: Date | null
}
