import type { AlignmentProjectObjectiveToODS } from '../entities/AlignmentProjectObjectiveToODS'

export interface AlignmentProjectObjectiveToODSFilters {
  projectObjectiveId?: number
  odsObjectiveId?: number
}

export interface IAlignmentProjectObjectiveToODSRepository {
  findById(id: number): Promise<AlignmentProjectObjectiveToODS | null>
  findMany(
    filters?: AlignmentProjectObjectiveToODSFilters,
  ): Promise<AlignmentProjectObjectiveToODS[]>
  save(
    alignment: AlignmentProjectObjectiveToODS,
  ): Promise<AlignmentProjectObjectiveToODS>
  delete(id: number): Promise<void>
  findByProjectObjectiveId(
    objectiveId: number,
  ): Promise<AlignmentProjectObjectiveToODS[]>
  findByODSObjectiveId(
    objectiveId: number,
  ): Promise<AlignmentProjectObjectiveToODS[]>
  existsByObjectivePair(
    projectObjectiveId: number,
    odsObjectiveId: number,
  ): Promise<boolean>
  deleteByObjectivePair(
    projectObjectiveId: number,
    odsObjectiveId: number,
  ): Promise<void>
}
