export interface CreateProgramDTO {
  name: string
  description?: string | null
  startDate?: Date | null
  endDate?: Date | null
  estimatedInversion?: number | null
  responsibleUid: string
}
