export interface UpdateUserDTO {
  uid: string
  name?: string
  password?: string
  active?: boolean
  // Person data
  firstName?: string
  lastName?: string
  dni?: string
}
