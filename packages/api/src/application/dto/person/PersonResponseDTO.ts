export interface PersonResponseDTO {
  id: number
  uid: string
  firstName: string
  lastName: string
  fullName: string
  dni: string
  active: boolean
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date | null
}
