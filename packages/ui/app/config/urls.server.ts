export const IS_PRODUCTION = process.env.ENVIRONMENT === 'production'
export const IS_DEVELOPMENT = process.env.ENVIRONMENT === 'development'
export const IS_STAGING = process.env.ENVIRONMENT === 'staging'

export const API_URL = IS_PRODUCTION
  ? 'https://api.utpl-practicum.bmacias.dev/graphql'
  : IS_STAGING
    ? 'https://staging.api.utpl-practicum.bmacias.dev/graphql'
    : 'http://localhost:6002/graphql'
