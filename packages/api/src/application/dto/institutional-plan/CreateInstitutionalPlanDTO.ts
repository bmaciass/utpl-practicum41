export interface CreateInstitutionalPlanDTO {
  name: string
  description: string
  year: number
  url?: string | null
  institutionUid: string
}
