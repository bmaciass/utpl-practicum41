export interface CreateProgramDTO {
  name: string
  description?: string | null
  startDate?: Date | null
  endDate?: Date | null
  responsibleUid: string
}
