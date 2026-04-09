# Decision Log

## 2026-04-09 - Initial architecture direction

Status: Accepted

### Decision

Use a pnpm monorepo with a modular-monolith architecture:

- apps/web-clinician (clinician-facing Next.js app)
- apps/web-patient (patient-facing shell, future)
- apps/api (API and domain orchestration)
- apps/worker (background processing)
- shared packages for UI, config, types, i18n, database, auth, observability, synthetic-data, risk-engine, summary-engine, fhir-model

### Why

This keeps the project maintainable, fast to build, and easy to explain while still demonstrating strong system design. Splitting clinician and patient apps allows independent evolution.

### Consequences

- easier local development
- lower coordination overhead
- future extraction remains possible if growth or team topology demands it
- clinician and patient concerns stay separate from the start

## 2026-04-09 - Separate clinician and patient web apps

Status: Accepted

### Decision

Use `apps/web-clinician` and `apps/web-patient` instead of a single `apps/web`.

### Why

The clinician and patient experiences have fundamentally different user needs, auth models, and UI patterns. Separating them avoids coupling and makes each app easier to reason about. The patient app is deferred to post-MVP but having the directory signals intent.

### Consequences

- shared UI primitives must live in `packages/ui`
- shared i18n keys must live in `packages/i18n`
- slightly more workspace configuration, but trivial with pnpm + Turborepo

## 2026-04-09 - Documentation-first approach

Status: Accepted

### Decision

Write all source-of-truth docs before implementing application code. Use markdown files in `docs/` as the canonical reference for product requirements, architecture, conventions, and quality gates.

### Why

Documentation-first reduces rework, keeps implementation aligned with intent, and makes the project reviewable by stakeholders before code exists.

### Consequences

- implementation must stay aligned with docs or docs must be updated first
- slower initial velocity but higher confidence in direction

## 2026-04-09 - ESLint flat config at root

Status: Accepted

### Decision

Use a single root `eslint.config.mjs` with ESLint v9 flat config and `typescript-eslint`. Each workspace member runs `eslint src/` and finds the root config via directory search.

### Why

Flat config eliminates the need for per-package `.eslintrc` files or a shared config package. One config file, zero duplication. `eslint-config-prettier` disables formatting rules so ESLint and Prettier don't conflict.

### Consequences

- single place to update lint rules
- all packages share the same rules (can add per-package overrides in the flat config if needed later)
- requires `.npmrc` public-hoist-pattern for eslint to be found from package directories

## 2026-04-09 - Vitest for unit and integration testing

Status: Accepted

### Decision

Use Vitest as the test runner for unit and integration tests. Per-package `vitest.config.ts` files where tests exist; stub scripts (`echo "no tests yet"`) elsewhere.

### Why

Vitest is fast, TypeScript-native, and compatible with the ESM setup. It avoids the configuration overhead of Jest in a modern TypeScript project.

### Consequences

- test scripts are consistent across packages
- packages without tests still participate in `pnpm test` without failure
- Playwright remains the choice for E2E tests (separate concern)

## 2026-04-09 - Tailwind v3 with shadcn/ui CSS variables

Status: Accepted

### Decision

Use Tailwind CSS v3 (not v4) with the shadcn/ui CSS custom property theming approach. Theme tokens are defined as CSS variables in `globals.css` (`:root` for light, `.dark` for dark) and referenced via `tailwind.config.ts` extensions.

### Why

shadcn/ui components are authored for Tailwind v3. Using v3 avoids adaptation friction and maintains compatibility with the shadcn/ui ecosystem. The CSS variable approach enables dark mode via the `class` strategy with `next-themes`.

### Consequences

- all colors use semantic tokens (`bg-background`, `text-foreground`, etc.)
- dark mode works via `.dark` class on `<html>`
- components from `packages/ui` automatically adapt to both themes
- if upgrading to Tailwind v4 later, migrate CSS variables to `@theme` directives

## 2026-04-09 - Translation dictionaries in app, not package

Status: Accepted

### Decision

Place EN/FR message dictionaries in `apps/web-clinician/src/messages/` rather than in `packages/i18n`. The `@t1d/i18n` package holds only locale utilities (type guards, constants).

### Why

Dictionaries contain app-specific copy (dashboard labels, nav items). Putting them in the app keeps them close to the UI that uses them. If a second app needs shared strings, extract a shared dictionary layer then.

### Consequences

- `packages/i18n` remains lightweight and reusable
- each app owns its own translations
- no cross-app translation coupling

## 2026-04-09 - transpilePackages for @t1d/ui

Status: Accepted

### Decision

Use Next.js `transpilePackages: ['@t1d/ui']` to compile the UI package source directly rather than pre-building it.

### Why

This avoids maintaining a separate build step for the UI package during development. Next.js compiles the TSX source directly from `packages/ui/src/`. The `tsc` build script serves as a type-checking gate only.

### Consequences

- faster dev loop (no watch build for packages/ui)
- `packages/ui` content paths must be included in the app's `tailwind.config.ts`
- package can only be consumed by bundler-aware consumers (fine for this monorepo)

## 2026-04-09 - next-intl v4 with App Router middleware routing

Status: Accepted

### Decision

Use next-intl v4 with middleware-based locale routing. URL structure: `/{locale}/...` (e.g., `/en/`, `/fr/`). Middleware redirects `/` to `/{defaultLocale}`. App uses `[locale]` route segment.

### Why

This is the recommended next-intl v4 pattern for App Router. It provides locale-aware navigation, server-side locale detection, and clean URL structure.

### Consequences

- all routes are prefixed with locale
- locale-aware `Link`, `useRouter`, `usePathname` from `@/i18n/navigation`
- `setRequestLocale()` must be called in every page/layout for static rendering

## 2026-04-09 - Mock auth via packages/auth with cookie-based user switching

Status: Accepted

### Decision

Implement mock auth as a pure TypeScript module in `packages/auth`. No HTTP auth flow. `getSession()` returns a demo user object. User switching stores the selected user ID in a client-side cookie (`t1d_demo_user`), which the server layout reads to resolve the active user.

Five predefined demo users cover all roles: clinician (default), educator, admin, patient, caregiver.

### Why

This keeps the demo self-contained (no external auth provider needed) while the architecture supports real auth replacement later. The only function that would change in production is `getSession()` — the rest (role checks, guards, types) remain the same.

### Consequences

- `getSession()` is the single seam for auth replacement
- `hasRole`, `hasAnyRole`, `requireRole` work identically with real or mock auth
- cookie-based user switching is demo-only and has no security — acceptable for MVP
- all components receive the user via props from the server layout, not from a global client store

## 2026-04-09 - Sidebar navigation pattern for clinician app

Status: Accepted

### Decision

Use a fixed sidebar navigation (desktop) with a horizontal mobile nav bar. The sidebar contains Dashboard, Patients, and Settings links with icons and localized labels. Active state is indicated visually.

### Why

Clinical apps are information-dense. A persistent sidebar provides stable navigation landmarks and keeps the main content area maximized. This matches standard healthcare app patterns.

### Consequences

- navigation is always visible on desktop
- mobile gets a compact horizontal nav bar
- sidebar width (w-56) is consistent and predictable
- adding new nav items is a single-line change to the NAV_ITEMS array

## 2026-04-09 - Prisma in packages/database with UUID primary keys

Status: Accepted

### Decision

Place Prisma schema in `packages/database/prisma/schema.prisma`. Use UUIDs (`@default(uuid())`) for all primary keys. Export a singleton `PrismaClient` from `packages/database/src/index.ts`.

### Why

UUIDs are safe for distributed systems, avoid auto-increment leakage, and are consistent across all tables. The singleton pattern prevents connection pool exhaustion during development HMR cycles. Placing Prisma in the database package keeps the schema co-located with the client.

### Consequences

- all entities use string UUIDs as IDs
- no auto-increment sequences to manage
- UUID generation happens at the database level
- singleton is cached on `globalThis` in development mode
- consumers import `prisma` from `@t1d/database`

## 2026-04-09 - Json fields for semi-structured domain data

Status: Accepted

### Decision

Use Prisma `Json` type for `factors` (RiskAssessment), `metadata` (Observation, Alert, AuditEvent), `content` and `sourceSnapshot` (GeneratedSummary). These fields hold semi-structured data that varies by context.

### Why

These fields are inherently polymorphic — risk factors, observation metadata, and summary content have different shapes depending on the source or computation. Modeling each variant as a separate column would be premature and fragile. Json fields provide flexibility while keeping the schema clean.

### Consequences

- these fields are not queryable via SQL column operations (use Postgres JSONB operators or filter in application code)
- type safety for Json field contents comes from application-level Zod validation (not Prisma)
- schema is simpler and more extensible

## 2026-04-09 - Synthetic data in packages/synthetic-data, pure generators

Status: Accepted

### Decision

Place all synthetic data generation logic in `packages/synthetic-data` as pure functions that return plain objects. The package has zero database dependency — it generates data structures that the seed script in `packages/database/prisma/seed.ts` persists via Prisma.

### Why

Keeping generation separate from persistence makes generators testable without a database, reusable for different persistence strategies, and easy to modify without touching DB code. The seed script is the only integration point.

### Consequences

- `@t1d/synthetic-data` is testable in isolation (20 unit tests, no DB needed)
- `packages/database` depends on `@t1d/synthetic-data`, not the reverse
- adding new event types or archetypes doesn't require schema changes
- seed pipeline handles batch inserts for performance

## 2026-04-09 - Deterministic PRNG with mulberry32

Status: Accepted

### Decision

Use a mulberry32-based seeded PRNG instead of `Math.random()`. Each patient story is seeded from `baseSeed + index * 1000`, making all generated data deterministic.

### Why

Deterministic generation makes demos repeatable, tests stable, and debugging reproducible. No external PRNG library is needed — mulberry32 is 6 lines of code with excellent distribution properties.

### Consequences

- same seed always produces same patients, observations, and clinical events
- different base seeds produce entirely different datasets
- tests can assert exact values without flakiness

## 2026-04-09 - Five patient archetypes for demo stories

Status: Accepted

### Decision

Define 5 archetypes that drive all generation: well-controlled, declining, high-risk, newly-diagnosed, non-adherent. Each archetype configures glucose mean/stdDev, CGM coverage, risk tier, alert/task counts, HbA1c, and device presence.

### Why

The dashboard demo needs visible variety. Each archetype produces a distinct clinical story that exercises different UI pathways: the "model patient" shows low risk, "declining" triggers review, "high-risk" shows urgent alerts, "newly-diagnosed" has sparse data, and "non-adherent" shows device disconnects.

### Consequences

- 30 patients (6 per archetype) gives a realistic population spread
- dashboard KPIs have non-trivial values
- patient detail views show meaningfully different trajectories

## 2026-04-09 - Server-component database queries for dashboard

Status: Accepted

### Decision

The clinician dashboard fetches data via direct Prisma queries in Next.js server components. No API routes or data-fetching layer is needed — server components call `prisma.patient.findMany()` etc. directly. Filters are passed via URL search params.

### Why

Server components with direct DB access is the simplest correct approach for a monolith. It avoids unnecessary API abstraction, keeps the code co-located with the UI, and leverages Next.js streaming for progressive loading. URL search params make filters server-compatible and shareable.

### Consequences

- no API routes to maintain for the dashboard
- queries are co-located in `src/lib/queries/` for reuse
- filter state lives in URL params, not client state
- if an API layer is needed later (e.g., for mobile), extract queries into API routes at that point

## 2026-04-09 - Recharts for glucose charting

Status: Accepted

### Decision

Use Recharts for the longitudinal glucose chart. Render a 14-day LineChart with target range reference lines (70 and 180 mg/dL). Downsample to ~500 points for performance. Use CSS variable tokens (`hsl(var(--chart-1))`) for colors so the chart works in both themes.

### Why

Recharts is React-native, lightweight, SSR-safe, and the standard choice for Next.js. It supports responsive containers and custom styling. The CSS variable approach makes dark mode work without separate chart themes.

### Consequences

- recharts is a new runtime dependency (~45KB gzipped)
- glucose data is serialized as ISO strings for the client chart component
- downsampling prevents performance issues with large datasets
- chart tooltip and legend use semantic color tokens

## 2026-04-09 - Ingestion via Next.js API route with Zod + idempotency

Status: Accepted

### Decision

Implement ingestion as a Next.js API route (`POST /api/ingest`) in the web-clinician app. Payloads are validated with Zod, raw payloads are stored in a `RawPayload` model for traceability, events are normalized into `Observation` records, and idempotency is enforced via unique `sourceId`.

### Why

Using an API route in the existing Next.js app avoids spinning up a separate API service for MVP. The ingestion logic lives in `packages/database/src/ingestion/` so it's reusable if an API app is added later. Zod provides runtime validation matching the Prisma schema. The `sourceId` idempotency key prevents duplicate processing of the same payload.

### Consequences

- ingestion endpoint is co-located with the web app (acceptable for MVP)
- raw payload is preserved with full JSON for debugging and reprocessing
- each observation links back to its raw payload via `sourcePayloadId`
- same sourceId sent twice returns 200 (duplicate) instead of creating duplicates
- derived metric triggers are deferred to Epic 10

## 2026-04-09 - Pure risk-engine computation + materialized DailyMetric/WeeklyFeature tables

Status: Accepted

### Decision

Risk computation lives in `packages/risk-engine` as pure functions with zero database deps. The package exports `computeDailyMetrics`, `computeWeeklyFeatures`, and `computeRiskScore`. Results are persisted to `DailyMetric` and `WeeklyFeature` tables via an orchestrator in `packages/database/src/metrics/`.

Risk score formula: 6 weighted factors (TIR 25%, glucose variability 20%, HbA1c 20%, adherence 15%, hypoglycemia 10%, data recency 10%) → 0-100 score → LOW/MODERATE/HIGH/CRITICAL tier.

### Why

Pure functions are fully testable without a database. Materialized tables enable fast dashboard queries. The orchestrator pattern separates concerns: risk-engine owns the math, database owns persistence.

### Consequences

- 12 unit tests validate all metric math without any DB
- DailyMetric has unique constraint on (patientId, date) for idempotent upserts
- WeeklyFeature has unique constraint on (patientId, weekStart)
- Recomputation is triggered via `POST /api/compute-metrics`
- Risk factors use the same structure as the existing risk-explanation UI component
