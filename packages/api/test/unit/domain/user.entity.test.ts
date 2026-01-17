import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import {
  User,
  type CreateUserProps,
  type IPasswordService,
} from '../../../src/domain/entities/User'

const passwordService: IPasswordService = {
  hashPassword(password) {
    return { hash: `hash:${password}`, salt: 'salt' }
  },
  verifyPassword(password, hash, _salt) {
    return hash === `hash:${password}`
  },
}

const baseProps: CreateUserProps = {
  name: 'Ana Lopez',
  password: 'secret123',
  personId: 10,
  passwordService,
}

describe('User entity', () => {
  it('rejects short names', () => {
    expect(() => User.create({ ...baseProps, name: 'No' })).toThrow(
      ValidationError,
    )
  })

  it('rejects short passwords', () => {
    expect(() => User.create({ ...baseProps, password: '123' })).toThrow(
      ValidationError,
    )
  })
})
