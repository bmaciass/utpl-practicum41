import { describe, expect, it } from 'vitest'
import { calculateProjectCompletionReport } from '../../../src/presentation/graphql/types/queries/reports/projectCompletion'

describe('calculateProjectCompletionReport', () => {
  it('excludes cancelled objectives from the denominator', () => {
    expect(
      calculateProjectCompletionReport({
        totalActiveObjectives: 4,
        completedObjectives: 2,
        cancelledObjectives: 1,
      }),
    ).toEqual({
      completed: 2,
      total: 3,
      percentage: (2 / 3) * 100,
    })
  })

  it('returns zero progress when all active objectives are cancelled', () => {
    expect(
      calculateProjectCompletionReport({
        totalActiveObjectives: 2,
        completedObjectives: 0,
        cancelledObjectives: 2,
      }),
    ).toEqual({
      completed: 0,
      total: 0,
      percentage: 0,
    })
  })
})
