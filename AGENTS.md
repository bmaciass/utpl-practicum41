# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed with pnpm; target packages with `pnpm -F <name> ...`.
- `packages/api`: Cloudflare Worker GraphQL API following Clean Architecture (see `CLEAN_ARCHITECTURE.md`) with `domain/`, `application/`, `infrastructure/`, and `presentation/` layers plus DI in `di/`.
- `packages/ui`: Remix + Vite frontend for Cloudflare; routes live in `packages/ui/app/routes`, shared UI in `app/components`, GraphQL docs in `app/graphql` and `app/gql`.
- `packages/db`: Drizzle ORM config and migrations (`src/schema`, `migrations/`), helpers to recreate and migrate the Postgres database.
- `packages/shared`: Domain foundations shared by API and DB; `packages/shared/seeders` holds local seed scripts.
- Root `scripts/` contains utilities like `generate-local-env` to write `.env` for local DB access.

## Build, Test, and Development Commands
- Install deps with Node 22+: `pnpm install`.
- API: `pnpm -F @sigep/api dev` (Wrangler dev server), `pnpm -F @sigep/api codegen`, `pnpm -F @sigep/api test` (Vitest workers), `pnpm -F @sigep/api deploy` for Cloudflare.
- UI: `pnpm -F @sigep/ui dev` for Remix/Vite, `pnpm -F @sigep/ui build`, `pnpm -F @sigep/ui start` (runs codegen + build + Wrangler dev), `pnpm -F @sigep/ui typecheck`.
- Database: `pnpm -F @sigep/db gen` to refresh types and migrations, `pnpm -F @sigep/db migrate` to apply them, `pnpm -F @sigep/db local` to recreate the local DB and seed.
- Seeders: `pnpm -F @sigep/seeders seed:local` after generating `.env` via `scripts/generate-local-env`.
- Formatting: `pnpm biome:format` (Biome handles imports, 2-space indent, single quotes).

## Coding Style & Naming Conventions
- TypeScript + ESM everywhere; keep layers aligned with Clean Architecture (domain entities, DTOs, use cases, mappers, infra adapters, presentation resolvers).
- Files that hold classes match PascalCase entity/use-case names (e.g., `Institution.ts`); utilities and helpers use camelCase file names where present.
- Prefer pure domain logic in `packages/shared` and `packages/api/src/domain`, delegating IO to infra adapters. Keep Remix loaders/actions thin by delegating to API clients.
- Run Biome before committing; it enforces import order, spacing, and quote style. Avoid ad-hoc lint rules outside Biome unless agreed.

## Testing Guidelines
- API tests live under `packages/api/test` and run with Vitest in Cloudflare Worker mode; use `*.test.ts` naming and prefer unit tests at the application layer over resolver-level mocks.
- Add regression tests when fixing bugs; favor deterministic fixtures over live DB calls (mock repositories or use in-memory data where feasible).
- UI currently has no default harness; add component or integration tests alongside new features when possible and document how to run them.

## Commit & Pull Request Guidelines
- Use short, imperative commit messages with optional scope tags seen in history (e.g., `[ui] add plan crud`, `[api] ...`); avoid noisy punctuation.
- PRs should include: scope/goal summary, linked issues, screenshots or clips for UI changes, and notes on DB migrations or env updates.
- Verify Biome formatting, relevant build/test commands, and migration/seed steps before requesting review; mention any follow-ups or known gaps.

## Configuration & Environment Notes
- Generate local DB env with `./scripts/generate-local-env` (writes `.env` pointing to `postgres://root:root@127.0.0.1:6000/utpl_practicum`).
- Keep credentials out of commits; prefer `.env` for local and Wrangler secrets/bindings for Cloudflare deploys.
- When adding new entities or use cases, update DI bindings in `packages/api/src/di` and schema/resolvers in `packages/api/src/presentation` to keep the container and GraphQL surface in sync.
