import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import {
  Indicator,
  type CreateIndicatorProps,
} from '../../../src/domain/entities/Indicator'

const baseProps: CreateIndicatorProps = {
  name: 'Graduation rate',
  description: 'Tracks the share of students graduating on time.',
  type: 'percentage',
  unitType: '%',
  minValue: 0,
  maxValue: 100,
  goalId: 12,
  createdBy: 3,
}

describe('Indicator entity', () => {
  it('rejects short names', () => {
    expect(() => Indicator.create({ ...baseProps, name: 'No' })).toThrow(
      ValidationError,
    )
  })

  it('rejects short descriptions when provided', () => {
    expect(() =>
      Indicator.create({ ...baseProps, description: 'Too short' }),
    ).toThrow(ValidationError)
  })

  it('rejects invalid value ranges', () => {
    expect(() =>
      Indicator.create({ ...baseProps, minValue: 10, maxValue: 5 }),
    ).toThrow(ValidationError)
  })

  it('rejects missing goal id', () => {
    expect(() => Indicator.create({ ...baseProps, goalId: 0 })).toThrow(
      ValidationError,
    )
  })
})
