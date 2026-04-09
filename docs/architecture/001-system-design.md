# System Design

## Monorepo structure
- apps/web
- apps/api
- apps/worker
- packages/ui
- packages/config
- packages/types
- packages/i18n
- packages/database
- packages/observability
- packages/synthetic-data
- packages/risk-engine

## Frontend
The web app is built with Next.js App Router and TypeScript.

Responsibilities:
- clinician dashboard
- patient detail workflows
- locale-aware rendering
- theme-aware rendering
- route structure and app shell
- authenticated demo shell
- interaction with API layer

## API
The API app owns:
- domain-oriented endpoints
- input validation
- orchestration
- persistence access
- role-aware checks
- audit event creation where appropriate

## Worker
The worker app owns:
- derived metrics computation
- risk scoring jobs
- summary generation jobs
- ingestion follow-up jobs
- scheduled recomputation or seed-support jobs

## Storage
Primary storage:
- PostgreSQL for transactional and queryable domain data
- Redis for queues/cache
- optional object storage later for exports/artifacts

## Data flow
1. Source payload enters system
2. Payload is validated
3. Raw payload is preserved where needed
4. Payload is normalized to canonical events
5. Derived metrics are computed
6. Risk assessment is generated
7. Dashboard and patient detail surfaces query current state
8. Summary generation uses structured data and persisted outputs
9. Audit trail records key reads/writes where practical

## Auth strategy
Initial implementation uses mock/demo auth with role-aware behavior.
Later architecture should allow replacement with real auth provider without major UI rewrites.

## Theming strategy
- semantic tokens
- theme provider at root
- no scattered hardcoded color assumptions
- all components tested in light and dark mode

## Localization strategy
- EN and FR required
- centralized dictionaries
- no inline UI strings in application code
- localized formatting for date/time/numbers where relevant

## Operational strategy
- structured logs
- health checks
- consistent error handling
- testable computations
- CI enforcement of lint/typecheck/tests/build