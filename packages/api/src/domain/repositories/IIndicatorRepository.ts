import type { Indicator, IndicatorType } from '../entities/Indicator'

export interface IndicatorFilters {
  active?: boolean
  goalId?: number
  search?: string
  type?: IndicatorType
}

export interface FindManyIndicatorsOptions {
  where?: IndicatorFilters
  limit?: number
  offset?: number
  orderBy?: 'name' | 'createdAt'
  orderDirection?: 'asc' | 'desc'
}

export interface IIndicatorRepository {
  findById(id: number): Promise<Indicator | null>
  findByIds(ids: number[]): Promise<Indicator[]>
  findByUid(uid: string): Promise<Indicator | null>
  findByUidOrThrow(uid: string): Promise<Indicator>
  findByGoalId(goalId: number): Promise<Indicator[]>
  findByGoalIds(goalIds: number[]): Promise<Indicator[]>
  findMany(options?: FindManyIndicatorsOptions): Promise<Indicator[]>
  count(where?: IndicatorFilters): Promise<number>
  save(indicator: Indicator): Promise<Indicator>
  delete(uid: string): Promise<void>
}
