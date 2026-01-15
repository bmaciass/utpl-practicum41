export interface AlignmentPNDToODSResponseDTO {
  id: number
  pndObjective: {
    id: number
    uid: string
    name: string
  }
  odsObjective: {
    id: number
    uid: string
    name: string
  }
  createdAt: Date
}
