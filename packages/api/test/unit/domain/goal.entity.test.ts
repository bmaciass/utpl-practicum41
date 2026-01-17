import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import { Goal, type CreateGoalProps } from '../../../src/domain/entities/Goal'

const baseProps: CreateGoalProps = {
  name: 'Improve student retention',
  description: 'Increase retention across all cohorts this year.',
  institutionalObjectiveId: 42,
  createdBy: 7,
}

describe('Goal entity', () => {
  it('creates a goal with trimmed values', () => {
    const goal = Goal.create({
      ...baseProps,
      name: '  Improve student retention  ',
      description: '  Increase retention across all cohorts this year.  ',
    })

    expect(goal.name).toBe('Improve student retention')
    expect(goal.description).toBe(
      'Increase retention across all cohorts this year.',
    )
    expect(goal.active).toBe(true)
  })

  it('rejects short names', () => {
    expect(() => Goal.create({ ...baseProps, name: 'No' })).toThrow(
      ValidationError,
    )
  })

  it('rejects short descriptions', () => {
    expect(() =>
      Goal.create({ ...baseProps, description: 'Too short' }),
    ).toThrow(ValidationError)
  })
})
