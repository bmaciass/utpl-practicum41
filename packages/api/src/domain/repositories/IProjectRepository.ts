import type { IListableRepository, PaginationOptions } from '@sigep/shared'
import type { Project, ProjectStatus } from '../entities/Project'

export interface ProjectFilters {
  programId?: number
  responsibleId?: number
  status?: ProjectStatus
  active?: boolean
}

export interface FindManyProjectsOptions {
  where?: ProjectFilters
  pagination?: PaginationOptions
}

export interface IProjectRepository
  extends IListableRepository<Project, ProjectFilters> {
  findById(id: number): Promise<Project | null>
  findByUid(uid: string): Promise<Project | null>
  findByIds(ids: number[]): Promise<Project[]>
  findByUidOrThrow(uid: string): Promise<Project>
  findByProgramId(programId: number): Promise<Project[]>
  findMany(options?: FindManyProjectsOptions): Promise<Project[]>
  count(where?: ProjectFilters): Promise<number>
  save(project: Project): Promise<Project>
  delete(uid: string): Promise<void>
}
