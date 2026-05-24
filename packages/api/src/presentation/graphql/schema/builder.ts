import SchemaBuilder from '@pothos/core'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import {
  DateResolver,
  DateTimeISOResolver,
  JSONResolver,
} from 'graphql-scalars'
import { DecimalResolver } from '../types/scalars/Decimal'
import type { AppContext } from './context'

const builder = new SchemaBuilder<{
  Context: AppContext
  DefaultFieldNullability: false
  DefaultInputFieldRequiredness: true
  AuthScopes: {
    public: boolean
    protected: boolean
    admin: boolean
  }
  Scalars: {
    JSON: {
      // biome-ignore lint/suspicious/noExplicitAny: needed for type-safety when declaring pothos inputs
      Input: { [x: string]: any }
      Output: unknown
    }
    Decimal: {
      Input: number
      Output: number
    }
    Date: {
      Input: Date
      Output: Date
    }
    DateTime: {
      Input: Date
      Output: Date
    }
  }
}>({
  defaultFieldNullability: false,
  defaultInputFieldRequiredness: true,
  plugins: [ScopeAuthPlugin],
  scopeAuth: {
    // Treat all errors during auth as unauthorized
    treatErrorsAsUnauthorized: true,

    // Custom error messages
    unauthorizedError: (parent, context) => {
      if (!context.authenticated) {
        switch (context.auth.failureReason) {
          case 'missing_access_cookie':
            return new Error(
              'Authentication required: access-token-cookie was missing from the request',
            )
          case 'invalid_access_cookie':
            return new Error(
              'Authentication required: access-token-cookie could not be verified',
            )
          case 'invalid_access_token':
            return new Error(
              'Authentication required: access token verification failed',
            )
          default:
            return new Error('Authentication required')
        }
      }

      return new Error('Insufficient permissions')
    },

    authScopes: async (context) => {
      return {
        public: true,
        protected: context.authenticated,
        admin:
          context.authenticated === true &&
          context.token.roles.includes('admin'),
      }
    },
  },
})

builder.addScalarType('JSON', JSONResolver)
builder.addScalarType('Decimal', DecimalResolver)
builder.addScalarType('Date', DateResolver)
builder.addScalarType('DateTime', DateTimeISOResolver)

// always required since this "empty" query is the root query
builder.queryType({})
builder.mutationType({})

export default builder
