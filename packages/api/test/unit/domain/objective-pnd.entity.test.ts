import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import {
  ObjectivePND,
  type CreateObjectivePNDProps,
} from '../../../src/domain/entities/ObjectivePND'

const baseProps: CreateObjectivePNDProps = {
  name: 'Improve access to education',
  description: 'Expand access to higher education across the country.',
  createdBy: 7,
}

describe('ObjectivePND entity', () => {
  it('rejects short names', () => {
    expect(() => ObjectivePND.create({ ...baseProps, name: 'No' })).toThrow(
      ValidationError,
    )
  })

  it('rejects short descriptions', () => {
    expect(() =>
      ObjectivePND.create({ ...baseProps, description: 'Too short' }),
    ).toThrow(ValidationError)
  })
})
