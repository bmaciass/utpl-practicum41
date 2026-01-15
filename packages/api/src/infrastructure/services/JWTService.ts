import { type JWK, SignJWT, createLocalJWKSet, jwtVerify } from 'jose'
import { webcrypto } from 'node:crypto'
import type {
  IJWTService,
  TokenPair,
  TokenPayload,
} from '~/domain/services/IJWTService'

const ISSUER = 'auth.utpl-practicum.com'
const ACCESS_TOKEN_EXP = '10m'
const REFRESH_TOKEN_EXP = '1w'

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

  async createTokens(
    userId: string,
    claims?: { roles?: string[]; permissions?: string[] },
  ): Promise<TokenPair> {
    const privateKey = await this.getPrivateKey()
    const now = Date.now()

    const accessToken = await new SignJWT({
      sub: userId,
      iat: now,
      roles: claims?.roles ?? [],
      permissions: claims?.permissions ?? [],
    })
      .setExpirationTime(ACCESS_TOKEN_EXP)
      .setProtectedHeader({ alg: 'EdDSA' })
      .setIssuer(ISSUER)
      .sign(privateKey)

    const refreshToken = await new SignJWT({
      sub: userId,
      iat: now,
    })
      .setExpirationTime(REFRESH_TOKEN_EXP)
      .setProtectedHeader({ alg: 'EdDSA' })
      .setIssuer(ISSUER)
      .sign(privateKey)

    return { accessToken, refreshToken }
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

  async verifyRefreshToken(token: string): Promise<{ sub: string } | null> {
    try {
      const jwks = await this.getPublicJWKSet()
      const result = await jwtVerify(token, jwks, { issuer: ISSUER })
      return result.payload.sub ? { sub: result.payload.sub as string } : null
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

    return this.createTokens(result.payload.sub)
  }
}

export async function getDefaultJWTService() {
  const { getJWKS } = await import('~/config/env')
  const { privateJWK, publicJWK } = await getJWKS()
  return new JWTService(privateJWK, publicJWK)
}
