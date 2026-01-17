import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import {
  ObjectiveODS,
  type CreateObjectiveODSProps,
} from '../../../src/domain/entities/ObjectiveODS'

const baseProps: CreateObjectiveODSProps = {
  name: 'Reduce inequality',
  description: 'Ensure access to quality education for all communities.',
  createdBy: 9,
}

describe('ObjectiveODS entity', () => {
  it('rejects short names', () => {
    expect(() => ObjectiveODS.create({ ...baseProps, name: 'No' })).toThrow(
      ValidationError,
    )
  })

  it('rejects short descriptions', () => {
    expect(() =>
      ObjectiveODS.create({ ...baseProps, description: 'Too short' }),
    ).toThrow(ValidationError)
  })
})
