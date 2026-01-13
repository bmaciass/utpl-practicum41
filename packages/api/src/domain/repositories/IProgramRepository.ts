import type { IListableRepository, PaginationOptions } from '@sigep/shared'
import type { Program } from '../entities/Program'

export interface ProgramFilters {
  name?: string
  active?: boolean
}

export interface FindManyProgramsOptions {
  where?: ProgramFilters
  pagination?: PaginationOptions
}

export interface IProgramRepository
  extends IListableRepository<Program, ProgramFilters> {
  findById(id: number): Promise<Program | null>
  findByIds(ids: number[]): Promise<Program[]>
  findByUid(uid: string): Promise<Program | null>
  findByUidOrThrow(uid: string): Promise<Program>
  findMany(options?: FindManyProgramsOptions): Promise<Program[]>
  count(where?: ProgramFilters): Promise<number>
  save(program: Program): Promise<Program>
  delete(uid: string): Promise<void>
}
