import { describe, expect, it } from 'vitest'
import { formatPermission, parsePermission } from '../../../src/domain/entities/Permission'

describe('Permission value object', () => {
  it('formats permissions consistently', () => {
    expect(
      formatPermission({ action: 'read', effect: 'allow', scope: 'resource' }),
    ).toBe('resource:read:allow')
  })

  it('rejects invalid permission strings', () => {
    expect(() => parsePermission('invalid')).toThrow(Error)
  })
})
