import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import { Role, type CreateRoleProps } from '../../../src/domain/entities/Role'

const baseProps: CreateRoleProps = {
  name: 'Editor',
  createdBy: 2,
}

describe('Role entity', () => {
  it('rejects short names', () => {
    expect(() => Role.create({ ...baseProps, name: 'R' })).toThrow(
      ValidationError,
    )
  })
})
