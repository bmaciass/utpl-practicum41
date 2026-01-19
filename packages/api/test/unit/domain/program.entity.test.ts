import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import {
  Program,
  type CreateProgramProps,
} from '../../../src/domain/entities/Program'

const baseProps: CreateProgramProps = {
  name: 'Community outreach',
  description: 'Expand community outreach in local regions.',
  responsibleId: 8,
  createdBy: 4,
}

describe('Program entity', () => {
  it('rejects short names', () => {
    expect(() => Program.create({ ...baseProps, name: 'No' })).toThrow(
      ValidationError,
    )
  })
})
