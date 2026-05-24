export interface RefreshTokenInputDTO {
  refreshToken: string
}

export interface RefreshTokenResponseDTO {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: Date
  refreshTokenExpiresAt: Date
}
