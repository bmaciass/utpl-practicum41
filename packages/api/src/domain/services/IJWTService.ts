/**
 * Payload contenido en los tokens JWT.
 */
export interface TokenPayload {
  sub: string
  roles: string[]
  permissions: string[]
}

/**
 * Par de tokens generados durante autenticación.
 */
export interface TokenPair {
  accessToken: string
  refreshToken: string
}

/**
 * Interface para el servicio de JWT.
 * Define las operaciones de creación y verificación de tokens.
 */
export interface IJWTService {
  /**
   * Crea un par de tokens (access y refresh) para un usuario.
   * @param userId - UID del usuario
   * @param claims - Claims opcionales (roles y permissions) para incluir en el access token
   */
  createTokens(
    userId: string,
    claims?: { roles?: string[]; permissions?: string[] },
  ): Promise<TokenPair>

  /**
   * Verifica un access token y retorna su payload.
   * @param token - Token JWT a verificar
   * @returns Payload del token o null si es inválido
   */
  verifyAccessToken(token: string): Promise<TokenPayload | null>

  /**
   * Verifica un refresh token y retorna el user ID.
   * @param token - Refresh token a verificar
   * @returns Objeto con sub (user ID) o null si es inválido
   */
  verifyRefreshToken(token: string): Promise<{ sub: string } | null>

  /**
   * DEPRECATED: Usar verifyRefreshToken + createTokens en su lugar.
   * Este método no soporta roles/permissions.
   * @deprecated
   */
  refreshAccessToken(refreshToken: string): Promise<TokenPair>
}
