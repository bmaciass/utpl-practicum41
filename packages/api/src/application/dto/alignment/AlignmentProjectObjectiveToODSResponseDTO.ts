export interface AlignmentProjectObjectiveToODSResponseDTO {
  id: number
  projectObjective: {
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
