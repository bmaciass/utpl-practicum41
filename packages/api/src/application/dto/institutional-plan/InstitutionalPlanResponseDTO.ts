export interface InstitutionalPlanResponseDTO {
  uid: string
  name: string
  description: string
  year: number
  url: string | null
  active: boolean
  deletedAt: Date | null
  institutionId: number
}
