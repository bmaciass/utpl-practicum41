export interface UserResponseDTO {
  id: number
  uid: string
  name: string
  personId: number
  active: boolean
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date | null
}
