import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto'
import type { IPasswordService, PasswordHash } from '~/domain/entities/User'

export class PasswordService implements IPasswordService {
  private readonly iterations: number
  private readonly keyLength: number
  private readonly digest: string

  constructor(iterations = 100, keyLength = 64, digest = 'sha512') {
    this.iterations = iterations
    this.keyLength = keyLength
    this.digest = digest
  }

  hashPassword(password: string): PasswordHash {
    const salt = randomBytes(16).toString('hex')
    const hash = pbkdf2Sync(
      password,
      salt,
      this.iterations,
      this.keyLength,
      this.digest,
    ).toString('hex')

    return { salt, hash }
  }

  verifyPassword(password: string, hash: string, salt: string): boolean {
    const derivedHash = pbkdf2Sync(
      password,
      salt,
      this.iterations,
      this.keyLength,
      this.digest,
    ).toString('hex')

    const hashBuffer = Buffer.from(hash, 'hex')
    const derivedBuffer = Buffer.from(derivedHash, 'hex')

    if (hashBuffer.length !== derivedBuffer.length) {
      return false
    }

    return timingSafeEqual(hashBuffer, derivedBuffer)
  }
}
