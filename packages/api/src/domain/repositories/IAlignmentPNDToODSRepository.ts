import type { AlignmentPNDToODS } from '../entities/AlignmentPNDToODS'

export interface AlignmentPNDToODSFilters {
  pndObjectiveId?: number
  odsObjectiveId?: number
}

export interface IAlignmentPNDToODSRepository {
  // Core CRUD
  findById(id: number): Promise<AlignmentPNDToODS | null>
  findMany(filters?: AlignmentPNDToODSFilters): Promise<AlignmentPNDToODS[]>
  save(alignment: AlignmentPNDToODS): Promise<AlignmentPNDToODS>
  delete(id: number): Promise<void>

  // Business queries
  findByPNDObjectiveId(objectiveId: number): Promise<AlignmentPNDToODS[]>
  findByODSObjectiveId(objectiveId: number): Promise<AlignmentPNDToODS[]>
  existsByObjectivePair(pndId: number, odsId: number): Promise<boolean>
  deleteByObjectivePair(pndId: number, odsId: number): Promise<void>
}
