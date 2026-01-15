import type { AlignmentInstitutionalToPND } from '../entities/AlignmentInstitutionalToPND'

export interface AlignmentInstitutionalToPNDFilters {
  institutionalObjectiveId?: number
  pndObjectiveId?: number
}

export interface IAlignmentInstitutionalToPNDRepository {
  // Core CRUD
  findById(id: number): Promise<AlignmentInstitutionalToPND | null>
  findMany(
    filters?: AlignmentInstitutionalToPNDFilters,
  ): Promise<AlignmentInstitutionalToPND[]>
  save(
    alignment: AlignmentInstitutionalToPND,
  ): Promise<AlignmentInstitutionalToPND>
  delete(id: number): Promise<void>

  // Business queries
  findByInstitutionalObjectiveId(
    objectiveId: number,
  ): Promise<AlignmentInstitutionalToPND[]>
  findByPNDObjectiveId(
    objectiveId: number,
  ): Promise<AlignmentInstitutionalToPND[]>
  existsByObjectivePair(
    institutionalId: number,
    pndId: number,
  ): Promise<boolean>
  deleteByObjectivePair(institutionalId: number, pndId: number): Promise<void>
}
