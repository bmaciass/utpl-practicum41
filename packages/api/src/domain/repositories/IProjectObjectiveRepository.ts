import type { IListableRepository, PaginationOptions } from '@sigep/shared'
import type {
  ProjectObjective,
  ProjectObjectiveStatus,
} from '../entities/ProjectObjective'

export interface ProjectObjectiveFilters {
  id?: number[]
  projectId?: number
  status?: ProjectObjectiveStatus
  active?: boolean
}

export interface FindManyProjectObjectivesOptions {
  where?: ProjectObjectiveFilters
  pagination?: PaginationOptions
}

export interface IProjectObjectiveRepository
  extends IListableRepository<ProjectObjective, ProjectObjectiveFilters> {
  findById(id: number): Promise<ProjectObjective | null>
  findByIds(ids: number[]): Promise<ProjectObjective[]>
  findByUid(uid: string): Promise<ProjectObjective | null>
  findByUidOrThrow(uid: string): Promise<ProjectObjective>
  findByProjectId(id: number): Promise<ProjectObjective[]>
  findMany(
    options?: FindManyProjectObjectivesOptions,
  ): Promise<ProjectObjective[]>
  count(where?: ProjectObjectiveFilters): Promise<number>
  save(objective: ProjectObjective): Promise<ProjectObjective>
  delete(uid: string): Promise<void>
}
