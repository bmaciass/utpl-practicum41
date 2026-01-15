export interface InstitutionalPlanResponseDTO {
  uid: string
  name: string
  year: number
  url: string
  active: boolean
  deletedAt: Date | null
  institutionId: number
}
