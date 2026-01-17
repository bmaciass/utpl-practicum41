# API Tests

Unit tests live in `test/unit` and focus on pure domain and application
logic. Integration tests live in `test/integration` and exercise the
Worker end-to-end, so they require a local database and valid env vars
from `wrangler.jsonc`.

Commands:
- `pnpm -F @sigep/api test:unit`
- `pnpm -F @sigep/api test:integration`
- `pnpm -F @sigep/api test:coverage`
