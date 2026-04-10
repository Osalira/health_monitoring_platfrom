# Definition of Done

A task is done only if all of the following are true:

## Code quality

- the scoped implementation is complete
- source-of-truth docs still match reality
- relevant tests were added or updated
- lint passes
- typecheck passes
- relevant test suites pass
- build passes

## Documentation

- docs/product/backlog.md was updated
- docs/ux/manual-checks.md was updated
- docs/engineering/decision-log.md was updated if decisions changed

## UI standards

- all user-facing strings are localized
- affected UI works in English and French
- affected UI works in light and dark mode
- basic accessibility checks were considered

## Deployment readiness

- no hardcoded localhost URLs in committed code (use env vars)
- no secrets committed (DATABASE_URL, API keys etc. via env)
- schema changes have corresponding migration or db:push compatibility
- seed script remains idempotent after changes
- health check endpoint (`/api/health`) still returns ok
- build succeeds in production mode (`next build`)

## Operational

- known limitations are documented
- error states are handled (no unhandled promise rejections in API routes)
- new API routes include audit event logging
