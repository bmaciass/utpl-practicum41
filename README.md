# utpl-practicum41

Sistema de Gestion de la Planificacion.

## Requirements

- Node `22` (`.nvmrc`)
- `pnpm` `10.6.1`
- Docker

Install dependencies first:

```sh
pnpm install
```

## Start the Project Locally

### 1. Start Postgres

The local database runs from `packages/infra/local/docker-compose.yml` and exposes Postgres on port `6000`.

```sh
docker compose -f packages/infra/local/docker-compose.yml up -d
```

### 2. Create the local database env

This generates `packages/db/.env` and `packages/shared/seeders/.env` with the local `DATABASE_URL`.

```sh
pnpm -F @sigep/db gen:env
pnpm -F @sigep/seeders gen:env
```

### 3. Apply migrations

Run the current migrations against the local database:

```sh
pnpm -F @sigep/db migrate
```

### 4. Seed local data

Populate the database with local test data:

```sh
pnpm -F @sigep/seeders seed:local
```

The current seed creates example users including:

- `admin` / `admin`
- `bryan` / `bryan`

### 5. Start the API

The API runs as a Cloudflare Worker on port `6002`.

```sh
pnpm -F @sigep/api dev
```

### 6. Start the UI

Start the Remix frontend in a separate terminal:

```sh
pnpm -F @sigep/ui dev
```

The UI reads the API from `http://localhost:6002/graphql`.

## One-Command Local Reset

If you want a clean local database, this command recreates the database, applies migrations, and runs the local seeders:

```sh
pnpm -F @sigep/db local
```

## Migration Workflow

When changing the Drizzle schema in `packages/db/src/schema`:

### Create a new migration

```sh
pnpm -F @sigep/db gen -- add-user-status
```

This regenerates schema exports, refreshes the local env, and writes a new SQL migration to `packages/db/migrations`.

### Apply migrations locally

```sh
pnpm -F @sigep/db migrate
```

If you need to rebuild from scratch after a schema change:

```sh
pnpm -F @sigep/db local
```

## Useful Commands

```sh
pnpm -F @sigep/api test:unit
pnpm -F @sigep/api test:integration
pnpm -F @sigep/api test:coverage
pnpm -F @sigep/api check
pnpm -F @sigep/ui check
pnpm -F @sigep/ui codegen
pnpm biome format --write .
```

## Local Ports

- Postgres: `127.0.0.1:6000`
- API: `http://localhost:6002/graphql`
