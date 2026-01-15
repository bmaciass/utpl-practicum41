import type { IListableRepository, PaginationOptions } from '@sigep/shared'
import type { ProjectTask, ProjectTaskStatus } from '../entities/ProjectTask'

export interface ProjectTaskFilters {
  projectId?: number
  status?: ProjectTaskStatus
  active?: boolean
}

export interface FindManyProjectTasksOptions {
  where?: ProjectTaskFilters
  pagination?: PaginationOptions
}

export interface IProjectTaskRepository
  extends IListableRepository<ProjectTask, ProjectTaskFilters> {
  findById(id: number): Promise<ProjectTask | null>
  findByIds(ids: number[]): Promise<ProjectTask[]>
  findByUid(uid: string): Promise<ProjectTask | null>
  findByUidOrThrow(uid: string): Promise<ProjectTask>
  findByProjectId(id: number): Promise<ProjectTask[]>
  findMany(options?: FindManyProjectTasksOptions): Promise<ProjectTask[]>
  count(where?: ProjectTaskFilters): Promise<number>
  save(goal: ProjectTask): Promise<ProjectTask>
  delete(uid: string): Promise<void>
}
