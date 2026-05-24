import { type JWK, SignJWT, createLocalJWKSet, jwtVerify } from 'jose'
import { webcrypto } from 'node:crypto'
import type {
  IJWTService,
  RefreshTokenPayload,
  TokenPair,
  TokenPayload,
} from '~/domain/services/IJWTService'
import {
  ACCESS_TOKEN_TTL_MS,
  REFRESH_SESSION_ABSOLUTE_TTL_MS,
} from '~/application/use-cases/auth/authSessionConfig'

const ISSUER = 'auth.utpl-practicum.com'

/**
 * Servicio de JWT que implementa la creación y verificación de tokens.
 * Usa Ed25519 para firma y verificación.
 *
 * Nota: La inicialización del signer es lazy debido a requerimientos
 * de Cloudflare Workers (las claves se obtienen de env variables).
 */
class JWTService implements IJWTService {
  private privateJWK: CryptoKey | null = null

  constructor(
    private privateJWKString: string,
    private publicJWKString: string,
  ) {}

  private async getPrivateKey(): Promise<CryptoKey> {
    if (!this.privateJWK) {
      this.privateJWK = await webcrypto.subtle.importKey(
        'jwk',
        JSON.parse(this.privateJWKString),
        'Ed25519',
        true,
        ['sign'],
      )
    }
    return this.privateJWK
  }

  private async getPublicJWKSet() {
    return createLocalJWKSet({
      keys: [JSON.parse(this.publicJWKString) as JWK],
    })
  }

  async hashToken(token: string): Promise<string> {
    const digest = await webcrypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(token),
    )
    return Buffer.from(digest).toString('hex')
  }

  async compareTokenHash(token: string, hash: string): Promise<boolean> {
    return (await this.hashToken(token)) === hash
  }

  async createTokens(
    userId: string,
    claims?: { roles?: string[]; permissions?: string[] },
    refreshSession?: {
      sessionId: string
      tokenId: string
      expiresAt: Date
    },
  ): Promise<TokenPair> {
    const privateKey = await this.getPrivateKey()
    const now = new Date()
    const accessTokenExpiresAt = new Date(now.getTime() + ACCESS_TOKEN_TTL_MS)
    const fallbackRefreshExpiresAt = new Date(
      now.getTime() + REFRESH_SESSION_ABSOLUTE_TTL_MS,
    )
    const refreshTokenExpiresAt =
      refreshSession?.expiresAt ?? fallbackRefreshExpiresAt
    const sessionId = refreshSession?.sessionId ?? crypto.randomUUID()
    const tokenId = refreshSession?.tokenId ?? crypto.randomUUID()

    const accessToken = await new SignJWT({
      sub: userId,
      iat: Math.floor(now.getTime() / 1000),
      roles: claims?.roles ?? [],
      permissions: claims?.permissions ?? [],
    })
      .setExpirationTime(accessTokenExpiresAt)
      .setProtectedHeader({ alg: 'EdDSA' })
      .setIssuer(ISSUER)
      .sign(privateKey)

    const refreshToken = await new SignJWT({
      sub: userId,
      sid: sessionId,
      jti: tokenId,
      iat: Math.floor(now.getTime() / 1000),
    })
      .setExpirationTime(refreshTokenExpiresAt)
      .setProtectedHeader({ alg: 'EdDSA' })
      .setIssuer(ISSUER)
      .sign(privateKey)

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    }
  }

  async verifyAccessToken(token: string): Promise<TokenPayload | null> {
    try {
      const jwks = await this.getPublicJWKSet()
      const result = await jwtVerify(token, jwks, { issuer: ISSUER })

      return {
        sub: result.payload.sub ?? '',
        roles: (result.payload.roles as string[]) ?? [],
        permissions: (result.payload.permissions as string[]) ?? [],
      }
    } catch {
      return null
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
    try {
      const jwks = await this.getPublicJWKSet()
      const result = await jwtVerify(token, jwks, { issuer: ISSUER })
      const sub = result.payload.sub
      const sessionId = result.payload.sid
      const tokenId = result.payload.jti

      if (
        typeof sub !== 'string' ||
        typeof sessionId !== 'string' ||
        typeof tokenId !== 'string'
      ) {
        return null
      }

      return { sub, sessionId, tokenId }
    } catch {
      return null
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    const jwks = await this.getPublicJWKSet()
    const result = await jwtVerify(refreshToken, jwks, { issuer: ISSUER })

    if (!result.payload.sub) {
      throw new Error('Invalid refresh token: missing subject')
    }

    return this.createTokens(result.payload.sub as string)
  }
}

export async function getDefaultJWTService() {
  const { getJWKS } = await import('~/config/env')
  const { privateJWK, publicJWK } = await getJWKS()
  return new JWTService(privateJWK, publicJWK)
}
