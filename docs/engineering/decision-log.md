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
