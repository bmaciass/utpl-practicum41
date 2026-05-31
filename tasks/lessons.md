# Lessons Learned

## 2026-05-29 - Communication

**Mistake**: Split the runtime and admin database URLs but changed the local env generator to emit only `DIRECT_DATABASE_URL`.
**Pattern**: Applied the new contract too literally without checking the repo's local development flow still needs `DATABASE_URL` for Wrangler-based app runtime.
**Rule**: When splitting env responsibilities, preserve the full local development contract and generate every variable still required by runtime tooling, even if multiple vars share the same local value.
**Applied**: Env generators, Wrangler local setup, and any future config splits between runtime and admin database connections.
