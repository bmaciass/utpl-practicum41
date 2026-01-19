import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import {
  Person,
  type CreatePersonProps,
} from '../../../src/domain/entities/Person'

const baseProps: CreatePersonProps = {
  firstName: 'Ana',
  lastName: 'Lopez',
  dni: '1234567890',
}

describe('Person entity', () => {
  it('rejects short first names', () => {
    expect(() => Person.create({ ...baseProps, firstName: 'A' })).toThrow(
      ValidationError,
    )
  })

  it('rejects short last names', () => {
    expect(() => Person.create({ ...baseProps, lastName: 'B' })).toThrow(
      ValidationError,
    )
  })

  it('rejects short dni values', () => {
    expect(() => Person.create({ ...baseProps, dni: '1234' })).toThrow(
      ValidationError,
    )
  })
})
