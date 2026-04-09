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
