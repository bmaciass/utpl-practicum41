import type { IListableRepository, PaginationOptions } from '@sigep/shared'
import type { ProjectGoal, ProjectGoalStatus } from '../entities/ProjectGoal'

export interface ProjectGoalFilters {
  projectId?: number
  status?: ProjectGoalStatus
  active?: boolean
}

export interface FindManyProjectGoalsOptions {
  where?: ProjectGoalFilters
  pagination?: PaginationOptions
}

export interface IProjectGoalRepository
  extends IListableRepository<ProjectGoal, ProjectGoalFilters> {
  findById(id: number): Promise<ProjectGoal | null>
  findByIds(ids: number[]): Promise<ProjectGoal[]>
  findByUid(uid: string): Promise<ProjectGoal | null>
  findByUidOrThrow(uid: string): Promise<ProjectGoal>
  findByProjectId(id: number): Promise<ProjectGoal[]>
  findMany(options?: FindManyProjectGoalsOptions): Promise<ProjectGoal[]>
  count(where?: ProjectGoalFilters): Promise<number>
  save(goal: ProjectGoal): Promise<ProjectGoal>
  delete(uid: string): Promise<void>
}
