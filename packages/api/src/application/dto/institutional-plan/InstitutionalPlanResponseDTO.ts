export interface InstitutionalPlanResponseDTO {
  uid: string
  name: string
  year: number
  version: number
  url: string
  active: boolean
  deletedAt: Date | null
  institutionId: number
}
