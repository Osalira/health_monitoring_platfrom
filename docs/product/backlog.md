# Backlog

## Status legend

- [ ] Not started
- [~] In progress
- [x] Done

## Epic 1 - Documentation and planning

- [x] PRD written
- [x] Architecture overview written
- [x] System design documented
- [x] Domain model documented
- [x] Frontend architecture documented
- [x] Backend architecture documented
- [x] Data ingestion documented
- [x] Security and privacy documented
- [x] Observability documented
- [x] Testing strategy documented
- [x] I18n and theming documented
- [x] Deployment documented
- [x] Tech stack documented
- [x] Conventions documented
- [x] Definition of done documented
- [x] Test matrix documented
- [x] Manual check baseline created
- [x] Decision log initialized
- [x] Release checklist created
- [x] README written
- [x] Roadmap written
- [x] Demo script written
- [x] Design principles documented
- [x] Copy guidelines documented

## Epic 2 - Monorepo and tooling

- [x] pnpm workspace scaffolded
- [x] Turborepo configured
- [x] Root scripts configured
- [x] Shared TypeScript config added
- [x] Shared lint/format config added (ESLint flat config + Prettier)
- [x] CI workflow added (GitHub Actions)
- [x] Env handling baseline added (.env.example)
- [x] All workspace members have package.json, tsconfig.json, src/index.ts
- [x] Vitest configured with sample test in @t1d/i18n
- [x] pnpm install / lint / typecheck / test / build all pass

## Epic 3 - UI foundation, theming, and i18n

- [x] Tailwind configured (v3 with shadcn/ui CSS variable theme)
- [x] Semantic theme tokens established (full light/dark CSS custom properties)
- [x] Dark mode support implemented (next-themes, class strategy, system default)
- [x] Locale infrastructure added (next-intl v4, middleware, [locale] routing)
- [x] EN dictionary added (structured: common, nav, dashboard, theme, locale)
- [x] FR dictionary added (mirror structure, French translations)
- [x] Theme toggle implemented (DropdownMenu with Light/Dark/System)
- [x] Locale switcher implemented (DropdownMenu with EN/FR, locale-aware navigation)
- [x] Shared UI primitives created (Button, Card, Badge, Input, Skeleton, Separator, DropdownMenu)
- [x] Accessibility baseline added (focus rings, aria-labels, keyboard navigation via Radix)

## Epic 4 - App shell and auth mock

- [x] App shell created (sidebar nav, mobile nav, responsive layout)
- [x] Route structure created (dashboard, patients, patients/[id], settings)
- [x] Mock auth/session layer added (packages/auth with demo users, cookie-based switching)
- [x] Role model helpers added (hasRole, hasAnyRole, requireRole, AuthorizationError)
- [x] Route guard strategy added (server-side session check, requireRole pattern)
- [x] Header/navigation added (user menu with role switcher, theme toggle, locale switcher)
- [x] Loading/empty/error states added (loading.tsx, error.tsx, not-found.tsx, EmptyState)

## Epic 5 - Database and domain implementation

- [x] Prisma configured (v6.19, schema.prisma in packages/database/prisma)
- [x] PostgreSQL connected (DATABASE_URL from .env, singleton client)
- [x] Core entities modeled (10 models: User, Patient, Device, Observation, Task, Alert, RiskAssessment, GeneratedSummary, AuditEvent, ConsentRecord)
- [x] Migrations working (prisma migrate dev / db:push ready)
- [x] Seed entrypoints added (prisma/seed.ts with demo users + sample patient/device/task)
- [x] Database package established (singleton PrismaClient export, type re-exports)

## Epic 6 - Synthetic data system

- [x] Patient generator added (demographics from name pools, seeded RNG)
- [x] Device/event generation added (glucose, insulin, meals, activity, labs, alerts, tasks, risk)
- [x] Archetypes documented (5: well-controlled, declining, high-risk, newly-diagnosed, non-adherent)
- [x] Deterministic seed support added (mulberry32 PRNG, same seed = same output)
- [x] Seed pipeline populates credible data (30 patients, ~270K observations, batch insert)

## Epic 7 - Clinician dashboard

- [x] KPI cards implemented (Total Patients, High Risk, Pending Tasks, Active Alerts — real DB queries)
- [x] Patient roster implemented (table with name, age, risk, score, HbA1c, sync, tasks, alerts)
- [x] Filtering/search added (text search by name, risk tier filter buttons, URL params)
- [x] Sync status added (relative time + color-coded dot: green/yellow/red)
- [x] Risk display integrated (RiskBadge component, color-coded by tier)
- [x] Loading/error/empty states complete (Skeleton loading, EmptyState, error.tsx)

## Epic 8 - Patient detail experience

- [ ] Patient header and summary added
- [ ] Longitudinal charting added
- [ ] Supporting context sections added
- [ ] Recent changes panel added
- [ ] Task/alert panel added
- [ ] Sparse data handling added

## Epic 9 - Ingestion and normalization

- [ ] Ingestion entrypoints added
- [ ] Payload validation added
- [ ] Raw payload storage added
- [ ] Normalized event flow added
- [ ] Idempotency strategy added
- [ ] Derived metric triggers added

## Epic 10 - Derived metrics and risk engine

- [ ] Daily metrics computation added
- [ ] Weekly features added
- [ ] Risk heuristics added
- [ ] Explainability factors added
- [ ] Risk persistence added
- [ ] UI integration completed

## Epic 11 - Care coordination and summaries

- [ ] Tasks workflow added
- [ ] Alerts workflow added
- [ ] Outreach log added
- [ ] Summary generation service added
- [ ] Summary persistence added
- [ ] Summary UI added

## Epic 12 - Audit, privacy, and observability

- [ ] Audit events implemented
- [ ] Audit viewer implemented
- [ ] Role-aware protections enforced
- [ ] Consent/privacy markers surfaced
- [ ] Structured logging added
- [ ] Health checks added
- [ ] Error handling improved

## Epic 13 - Demo hardening

- [ ] Demo stories surfaced in UI
- [ ] Accessibility pass completed
- [ ] Responsive polish completed
- [ ] README polished
- [ ] Demo script finalized
- [ ] Main flow e2e hardened

## Acceptance criteria pattern

For each completed item:

- code exists
- tests added or updated
- docs updated
- backlog updated
- manual checks updated
- verification commands run
