import { createCookie } from '@remix-run/cloudflare'
import { getDBConnection } from '@sigep/db'
import { useCookies } from '@whatwg-node/server-plugin-cookies'
import { env } from 'cloudflare:workers'
import { createYoga } from 'graphql-yoga'
import { getDefaultJWTService } from '~/infrastructure/services/JWTService'
import { createIndicatorsByGoalLoader } from '~/presentation/graphql/dataloaders/indicatorsByGoalLoader'
import { createInstitutionLoader } from '~/presentation/graphql/dataloaders/institutionLoader'
import { createInstitutionalObjectiveLoader } from '~/presentation/graphql/dataloaders/institutionalObjectiveLoader'
import { createPersonLoader } from '~/presentation/graphql/dataloaders/personLoader'
import { createProgramLoader } from '~/presentation/graphql/dataloaders/programLoader'
import { createProjectLoader } from '~/presentation/graphql/dataloaders/projectLoader'
import { createProjectObjectivesByProjectLoader } from '~/presentation/graphql/dataloaders/projectObjectivesByProjectLoader'
import { createProjectTasksByProjectLoader } from '~/presentation/graphql/dataloaders/projectTasksByProjectLoader'
import { createProjectByProgramLoader } from '~/presentation/graphql/dataloaders/projectsByProgram'
import { createUserLoader } from '~/presentation/graphql/dataloaders/userLoader'
import { useResponse } from '~/presentation/graphql/plugins/onResponse'
import schema from '~/presentation/graphql/schema'
import type {
  AppContext,
  AppDataloaders,
} from '~/presentation/graphql/schema/context'

export const getAccessTokenCookie = (secret: string) =>
  createCookie('access-token-cookie', {
    httpOnly: true,
    sameSite: env.ENVIRONMENT === 'production' ? 'none' : 'lax',
    path: '/',
    secure: env.ENVIRONMENT === 'production',
    maxAge: 600, // ten minutes
    secrets: [secret],
  })

async function createContext(request: Request, env: Env): Promise<AppContext> {
  // Connect to database
  const { db, client } = await getDBConnection(env.DATABASE_URL)
  await client.connect()

  const cookie = await request.cookieStore?.get('access-token-cookie')
  if (!cookie) throw new Error('cookie not found')

  const accessCookie = getAccessTokenCookie('cookie-secret')
  const tokenString = await accessCookie.parse(
    `access-token-cookie=${cookie.value}`,
  )
  if (!tokenString) throw new Error('token not found')

  const payload = await (await getDefaultJWTService()).verifyAccessToken(
    tokenString,
  )
  if (!payload) throw new Error('invalid token')

  const token = {
    permissions: payload.permissions ?? [],
    roles: payload.roles ?? [],
  } satisfies AppContext['token']
  const user = {
    uid: payload.sub,
  } satisfies AppContext['user']

  // Create DataLoaders for this request
  // Each request gets fresh loaders to ensure cache isolation
  const loaders = {
    indicatorsByGoal: createIndicatorsByGoalLoader(db),
    institution: createInstitutionLoader(db),
    institutionalObjective: createInstitutionalObjectiveLoader(db),
    user: createUserLoader(db),
    person: createPersonLoader(db),
    program: createProgramLoader(db),
    project: createProjectLoader(db),
    projectObjectivesByProject: createProjectObjectivesByProjectLoader(db),
    projectGoalsByProject: createProjectTasksByProjectLoader(db),
    projectByProgramId: createProjectByProgramLoader(db),
  } satisfies AppDataloaders

  return {
    authenticated: true,
    db,
    client,
    token,
    user,
    loaders,
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const yoga = createYoga({
      schema,
      context: () => {
        return createContext(request, env)
      },
      graphiql: async (req) => {
        // Always available in development
        if (env.ENVIRONMENT !== 'production') {
          return {
            title: 'SIGEP GraphQL API - Development',
            defaultQuery: `
            # GraphQL API Explorer
            query {
              __schema {
                types {
                  name
                }
              }
            }`,
          }
        }

        // In production, require authentication
        const cookie = await req.cookieStore?.get('access-token-cookie')
        if (!cookie) {
          return false // Disable GraphiQL - not authenticated
        }

        return {
          title: 'SIGEP GraphQL API - Production',
          defaultQuery: `
          query {
            __typename
          }`,
        }
      },
      plugins: [
        useCookies(),
        // useJWT({
        //   extendContext: true,
        //   signingKeyProviders: [
        //     createInlineSigningKeyProvider(env.PRIVATE_JWK),
        //   ],
        //   tokenLookupLocations: [
        //     extractFromCookie({ name: 'access-token-cookie' }),
        //   ],
        //   tokenVerification: {
        //     issuer: 'auth.utpl-practicum.com',
        //     ignoreExpiration: false,
        //   },
        // }),
        useResponse, // this plugin will close the connection at the end
      ],
    })
    return yoga(request)
  },
}
