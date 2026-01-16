import type { Goal } from '../entities/Goal'

export interface GoalFilters {
  active?: boolean
  institutionalObjectiveId?: number
  search?: string
}

export interface FindManyGoalsOptions {
  where?: GoalFilters
  limit?: number
  offset?: number
  orderBy?: 'name' | 'createdAt'
  orderDirection?: 'asc' | 'desc'
}

export interface IGoalRepository {
  findById(id: number): Promise<Goal | null>
  findByUid(uid: string): Promise<Goal | null>
  findByUidOrThrow(uid: string): Promise<Goal>
  findMany(options?: FindManyGoalsOptions): Promise<Goal[]>
  count(where?: GoalFilters): Promise<number>
  save(goal: Goal): Promise<Goal>
  delete(uid: string): Promise<void>
}
