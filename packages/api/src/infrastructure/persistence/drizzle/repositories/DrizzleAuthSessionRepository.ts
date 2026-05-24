import type { Db } from '@sigep/db'
import { AuthSession as AuthSessionTable } from '@sigep/db'
import { eq } from 'drizzle-orm'
import {
  type AuthSession,
  type CreateAuthSessionInput,
  type IAuthSessionRepository,
  type RotateAuthSessionInput,
} from '~/domain/repositories/IAuthSessionRepository'

export class DrizzleAuthSessionRepository implements IAuthSessionRepository {
  constructor(private db: Db) {}

  async create(input: CreateAuthSessionInput): Promise<AuthSession> {
    const [record] = await this.db
      .insert(AuthSessionTable)
      .values({
        uid: crypto.randomUUID(),
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        idleExpiresAt: input.idleExpiresAt,
        lastUsedAt: input.lastUsedAt,
      })
      .returning()

    return record
  }

  async findByUid(uid: string): Promise<AuthSession | null> {
    const record = await this.db.query.AuthSession.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })

    return record ?? null
  }

  async rotate(uid: string, input: RotateAuthSessionInput): Promise<AuthSession> {
    const [record] = await this.db
      .update(AuthSessionTable)
      .set({
        tokenHash: input.tokenHash,
        idleExpiresAt: input.idleExpiresAt,
        lastUsedAt: input.lastUsedAt,
        revokedAt: null,
      })
      .where(eq(AuthSessionTable.uid, uid))
      .returning()

    return record
  }

  async revoke(uid: string): Promise<void> {
    await this.db
      .update(AuthSessionTable)
      .set({
        revokedAt: new Date(),
      })
      .where(eq(AuthSessionTable.uid, uid))
  }
}
