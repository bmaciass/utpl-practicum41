// Simplified DTO - only includes owned data + foreign key UIDs
// Related entities (responsible User, projects) are resolved by GraphQL field resolvers
export interface ProgramResponseDTO {
  id: number
  uid: string
  name: string
  description: string | null
  startDate: Date | null
  endDate: Date | null
  active: boolean
  deletedAt: Date | null
  responsibleId: number
}
