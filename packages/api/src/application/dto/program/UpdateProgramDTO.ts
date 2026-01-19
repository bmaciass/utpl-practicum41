export interface UpdateProgramDTO {
  name?: string
  description?: string
  startDate?: Date | null
  endDate?: Date | null
  estimatedInversion?: number | null
  responsibleUid?: string
  active?: boolean
}
