import type { IListableRepository, PaginationOptions } from '@sigep/shared'
import type { Institution } from '../entities/Institution'

export interface InstitutionFilters {
  name?: {
    contains?: string
    equals?: string
  }
  active?: boolean
}

export interface FindManyInstitutionsOptions {
  where?: InstitutionFilters
  pagination?: PaginationOptions
}

export interface IInstitutionRepository
  extends IListableRepository<Institution, InstitutionFilters> {
  findById(id: number): Promise<Institution | null>
  findByUid(uid: string): Promise<Institution | null>
  findByIds(ids: number[]): Promise<Institution[]>
  findByUidOrThrow(uid: string): Promise<Institution>
  findMany(options?: FindManyInstitutionsOptions): Promise<Institution[]>
  count(where?: InstitutionFilters): Promise<number>
  save(institution: Institution): Promise<Institution>
  delete(uid: string): Promise<void>
  findByName(name: string): Promise<Institution | null>
  existsByName(name: string): Promise<boolean>
}
