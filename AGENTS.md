# Repository Guidelines

## Project Structure & Module Organization
- This repository is a `pnpm` workspace for SIGEP. Use `pnpm -F <name> ...` to target a specific package.
- Most work happens under `packages/`.
- `packages/api`: Cloudflare Worker GraphQL API following Clean Architecture (see `CLEAN_ARCHITECTURE.md`). Source lives in `src/`, with `domain/`, `application/`, `infrastructure/`, `presentation/`, and DI bindings in `di/`. Tests live in `test/unit` and `test/integration`.
- `packages/ui`: Remix + Vite frontend for Cloudflare. Routes live in `packages/ui/app/routes`; shared UI logic lives in `app/components`, `app/hooks`, `app/lib`, and `app/helpers`; GraphQL documents and generated artifacts live in `app/graphql` and `app/gql`.
- `packages/db`: Drizzle ORM schema, migrations, and local DB utilities. Main areas include `src/schema` and `migrations/`.
- `packages/shared`: Shared domain entities, ports, errors, GraphQL schemas, and other core foundations shared by API and DB.
- `packages/shared/seeders`: Local seed scripts.
- `packages/infra/local`: Local Postgres `docker-compose.yml`.
- Root `scripts/` contains utilities such as `generate-local-env` to write `.env` for local DB access.
- Keep changes inside the package that owns the concern. Shared business rules belong in `packages/shared`; persistence changes belong in `packages/db`; API orchestration belongs in `packages/api`; UI behavior belongs in `packages/ui`.

## Build, Test, and Development Commands
- Use Node `22` and `pnpm` `10.6.1`.
- `pnpm install`: install workspace dependencies.
- `docker compose -f packages/infra/local/docker-compose.yml up -d`: start local Postgres on port `6000`.
- `pnpm -F @sigep/db local`: recreate the local database, run migrations, and seed it.
- `pnpm -F @sigep/db migrate`: apply DB migrations.
- `pnpm -F @sigep/db gen`: refresh types and migrations.
- `pnpm -F @sigep/db gen -- <name>`: create a new Drizzle migration after schema changes.
- `pnpm -F @sigep/seeders seed:local`: run local seeders after generating `.env`.
- `pnpm -F @sigep/api dev`: run the Worker API locally with Wrangler.
- `pnpm -F @sigep/api codegen`: regenerate API-side generated files.
- `pnpm -F @sigep/api test`: run API tests with Vitest in Worker mode.
- `pnpm -F @sigep/api test:unit`: run API unit tests.
- `pnpm -F @sigep/api test:integration`: run API integration tests.
- `pnpm -F @sigep/api test:coverage`: run API tests with coverage.
- `pnpm -F @sigep/api check`: run the API TypeScript check.
- `pnpm -F @sigep/api deploy`: deploy the API to Cloudflare.
- `pnpm -F @sigep/ui dev`: run the frontend locally.
- `pnpm -F @sigep/ui build`: build the UI for production.
- `pnpm -F @sigep/ui start`: run UI codegen, build, and Wrangler dev.
- `pnpm -F @sigep/ui codegen`: regenerate GraphQL client artifacts for the frontend.
- `pnpm -F @sigep/ui check`: run the UI TypeScript check.
- `pnpm -F @sigep/ui typecheck`: run the UI type checker.
- `pnpm biome format --write .`: format the repo and organize imports.
- `pnpm biome:format`: run the repo formatting command.
- Local defaults: Postgres at `127.0.0.1:6000`, API Worker at `http://localhost:6002/graphql`, and a Wrangler-served UI frontend configured to use that API URL.

## Coding Style & Naming Conventions
- TypeScript + ESM is the default across packages.
- Follow the existing layered architecture: domain entities, DTOs, use cases, mappers, infrastructure adapters, and presentation resolvers.
- Files that hold classes should match PascalCase entity or use-case names such as `Institution.ts` or `Program.ts`.
- Use `PascalCase` for domain entities and React components.
- Use `camelCase` for helpers and utility modules.
- Use `useXxx.tsx` for React hooks.
- Route files should follow Remix naming conventions, including dynamic segments such as `_primary.users.$id.tsx`.
- Prefer pure domain logic in `packages/shared` and `packages/api/src/domain`, delegating IO to infrastructure adapters.
- Keep Remix loaders and actions thin by delegating to API clients.
- Match the current structure instead of introducing parallel patterns. For example, new domain validation usually belongs with the entity in `packages/shared`, while page-specific data access usually belongs under `packages/ui/app/hooks`.
- Run Biome before committing. It enforces import organization, spacing, `2`-space indentation, single quotes, and no required semicolons.
- Avoid ad hoc lint rules outside Biome unless agreed.

## Testing Guidelines
- Vitest is configured in `packages/api`.
- API tests live under `packages/api/test`, especially `test/unit` and `test/integration`.
- Use `*.test.ts` or `*.spec.ts` naming.
- Prefer unit tests at the application or domain layer over resolver-level mocks when feasible.
- Prefer `packages/api/test/unit` for domain and application behavior, and `packages/api/test/integration` for GraphQL or Worker flows.
- Add regression tests when fixing bugs.
- Favor deterministic fixtures over live DB calls by mocking repositories or using in-memory data where feasible.
- Integration tests require the local database and valid env generated by the repo scripts.
- Coverage is collected from `packages/api/src/**/*.ts`.
- Keep tests close to the behavior being changed and add or update tests for schema, resolver, entity, or migration-sensitive changes.
- UI currently has no default test harness; add component or integration tests alongside new features when possible and document how to run them.

## Architecture Notes
- The repo follows a layered split.
- `packages/shared` holds core domain and application abstractions.
- `packages/db` maps those concepts to Drizzle tables, relations, migrations, and DB helpers.
- `packages/api` exposes GraphQL operations and session/auth helpers on top of shared and DB packages.
- `packages/ui` consumes the API through generated GraphQL client code and route-level hooks.
- When changing a feature end to end, update the layers in that order and avoid putting database or transport logic directly into shared domain code.
- When adding new entities or use cases, update DI bindings in `packages/api/src/di` and schema/resolvers in `packages/api/src/presentation` so the container and GraphQL surface stay in sync.

## Configuration & Security
- Generate local DB env with `./scripts/generate-local-env`. It writes `.env` pointing to `postgres://root:root@127.0.0.1:6000/utpl_practicum`.
- Environment defaults may be checked into Wrangler configs for local development, including DB URLs and dev keys. Treat them as local-only examples.
- Keep credentials out of commits. Prefer `.env` for local development and Wrangler secrets or bindings for Cloudflare deployments.
- Do not commit real secrets, production credentials, or ad hoc env files with sensitive overrides.
- If a change needs new configuration, update the relevant script or Wrangler config and mention the new variable in the PR.

## Commit & Pull Request Guidelines
- Use short, imperative commit messages. Optional scope tags such as `[ui]` or `[api]` are consistent with the existing history.
- Recent examples include messages like `add project objectives and alignment with ods` and `[ui] add plan crud`.
- Keep commits focused by package or feature. Avoid mixing schema, API, and UI refactors unless they are part of one coherent change.
- PRs should include a clear summary of the change.
- PRs should identify affected packages.
- PRs should include linked issues or task references.
- PRs should include setup, migration, seed, env, or codegen steps reviewers must run.
- PRs should include screenshots, clips, or recordings for UI changes.
- PRs should mention DB migrations, env updates, new env vars, codegen output, breaking API changes, and any follow-ups or known gaps.
- Before requesting review, verify formatting, relevant build and test commands, and any required migration or seed steps.
