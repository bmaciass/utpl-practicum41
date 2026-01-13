export interface LoginUseCaseInputDTO {
  username: string
  password: string
}

export interface LoginUseCaseResponseDTO {
  accessToken: string
  refreshToken: string
}
