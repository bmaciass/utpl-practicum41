export interface AlignmentInstitutionalToPNDResponseDTO {
  id: number
  institutionalObjective: {
    id: number
    uid: string
    name: string
  }
  pndObjective: {
    id: number
    uid: string
    name: string
  }
  createdAt: Date
}
