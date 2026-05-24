export interface AuthSession {
  id: number
  uid: string
  userId: number
  tokenHash: string
  expiresAt: Date
  idleExpiresAt: Date
  lastUsedAt: Date
  revokedAt: Date | null
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateAuthSessionInput {
  userId: number
  tokenHash: string
  expiresAt: Date
  idleExpiresAt: Date
  lastUsedAt: Date
}

export interface RotateAuthSessionInput {
  tokenHash: string
  idleExpiresAt: Date
  lastUsedAt: Date
}

export interface IAuthSessionRepository {
  create(input: CreateAuthSessionInput): Promise<AuthSession>
  findByUid(uid: string): Promise<AuthSession | null>
  rotate(uid: string, input: RotateAuthSessionInput): Promise<AuthSession>
  revoke(uid: string): Promise<void>
}
