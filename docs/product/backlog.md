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
- [x] Core entities modeled (10 models + DailyMetric, WeeklyFeature, RawPayload, OutreachLog)
- [x] Migrations working (prisma migrate dev / db:push ready)
- [x] Seed entrypoints added (prisma/seed.ts with demo users + synthetic patients)
- [x] Database package established (singleton PrismaClient export, type re-exports)

## Epic 6 - Synthetic data system

- [x] Patient generator added (demographics from name pools, seeded RNG)
- [x] Device/event generation added (glucose, insulin, meals, activity, labs, alerts, tasks, risk)
- [x] Archetypes documented (5: well-controlled, declining, high-risk, newly-diagnosed, non-adherent)
- [x] Deterministic seed support added (mulberry32 PRNG, same seed = same output)
- [x] Seed pipeline populates credible data (30 patients, ~178K observations, batch insert)

## Epic 7 - Clinician dashboard

- [x] KPI cards implemented (Total Patients, High Risk, Pending Tasks, Active Alerts — real DB queries)
- [x] Patient roster implemented (table with name, age, risk, score, HbA1c, sync, tasks, alerts)
- [x] Filtering/search added (debounced text search, risk tier filter buttons, URL params)
- [x] Sync status added (relative time + color-coded dot, auto-refresh every 60s)
- [x] Risk display integrated (RiskBadge component, color-coded by tier, clickable KPI)
- [x] Pagination added (15 per page, prev/next, page counter)
- [x] Loading/error/empty states complete (Skeleton loading, EmptyState, error.tsx)

## Epic 8 - Patient detail experience

- [x] Patient header and summary added (name, age, dx date, devices, HbA1c, risk, sync, consent badges)
- [x] Longitudinal charting added (7/14/30-day glucose LineChart via Recharts, dark-mode aware)
- [x] Supporting context sections added (insulin, meals, activity, labs in 2×2 grid)
- [x] Recent changes panel added (risk explanation with localized factor labels + descriptions)
- [x] Task/alert panel added (sidebar with tasks + alerts, create/status-change/assign actions)
- [x] Outreach log added (OutreachLog panel with create form, type badges)
- [x] Summary section added (visit-prep with facts/trends/discussion, provenance citations, EN/FR)
- [x] Sparse data handling added (inline "no data" messages per section, empty chart state)

## Epic 9 - Ingestion and normalization

- [x] Ingestion entrypoints added (POST /api/ingest route in web-clinician)
- [x] Payload validation added (Zod schemas for payload + events)
- [x] Raw payload storage added (RawPayload model with sourceId idempotency key)
- [x] Normalized event flow added (events → Observation records with sourcePayloadId traceability)
- [x] Idempotency strategy added (unique sourceId check, duplicate returns 200)
- [x] Derived metric triggers added (placeholder — ingestion completes, metrics recomputation is Epic 10)

## Epic 10 - Derived metrics and risk engine

- [x] Daily metrics computation added (computeDailyMetrics: glucose stats, TIR, insulin/carb/activity totals)
- [x] Weekly features added (computeWeeklyFeatures: CV, avg TIR, adherence, hypo/hyper episodes)
- [x] Risk heuristics added (computeRiskScore: 6 weighted factors → 0-100 score → tier)
- [x] Explainability factors added (localized labels + descriptions, explainer note)
- [x] Risk persistence added (DailyMetric, WeeklyFeature models + upsert orchestration)
- [x] UI integration completed (POST /api/compute-metrics, clickable KPI, factor descriptions)

## Epic 11 - Care coordination and summaries

- [x] Tasks workflow added (POST /api/tasks, PATCH /api/tasks/[id], create-task dialog with user picker)
- [x] Alerts workflow added (PATCH /api/alerts/[id] acknowledge/resolve/dismiss, action buttons)
- [x] Outreach log added (OutreachLog model + API + panel with type selection)
- [x] Summary generation service added (packages/summary-engine: facts/trends/discussion with citations)
- [x] Summary persistence added (GeneratedSummary model, POST /api/summaries/generate with locale)
- [x] Summary UI added (SummarySection with sections, citation tags, provenance note, EN/FR)

## Epic 12 - Audit, privacy, and observability

- [x] Audit events implemented (createAuditEvent in all API routes + patient detail ACCESS)
- [x] Audit viewer implemented (/audit page with table: time, actor, action, resource, patient)
- [x] Role-aware protections enforced (requireRole/hasRole from @t1d/auth, session-based checks)
- [x] Consent/privacy markers surfaced (ConsentRecord badges on patient header, seeded per patient)
- [x] Structured logging added (console.error in all API routes with context tags)
- [x] Health checks added (GET /api/health with DB connectivity check)
- [x] Error handling improved (consistent try/catch in all API routes, typed error responses)
- [x] Actor tracking in audit events (cookie-based actorUserId extraction in all routes)

## Epic 13 - Deployment and release readiness

- [ ] Prisma migrations committed (future — using db:push for MVP)
- [x] Vercel deployment configured (vercel.json + DEPLOY.md with step-by-step guide)
- [x] Managed PostgreSQL provisioned (Supabase Postgres)
- [x] Environment variables configured (DATABASE_URL, SUPABASE_URL, PUBLISHABLE_KEY)
- [x] Seed script runs successfully on hosted database (30 patients, 178K observations)
- [x] Health check enhanced (version, uptime, DB latency, auth config status)
- [ ] Post-deploy verification completed (dashboard, patient detail, EN/FR, light/dark)
- [x] README updated with hosted URL, demo accounts, setup instructions, deployment guide
- [x] Synthetic data disclaimer visible in UI ("Synthetic Data" badge in header)
- [x] No hardcoded localhost URLs in production build
- [x] Environment validation added (fails loudly on missing DATABASE_URL)
- [x] Structured logger utility added (JSON-formatted for Vercel log parsing)
- [x] Tasks page added (/tasks — all open tasks across patients)
- [x] Alerts page added (/alerts — all active alerts across patients)
- [x] All KPI cards are interactive (Link-based locale-aware navigation)
- [x] Deployment guide written (docs/engineering/DEPLOY.md — Vercel + Supabase step-by-step)
- [x] Release notes written (RELEASE_NOTES.md — capabilities, data, limitations)
- [x] Reviewer sharing guidance in DEPLOY.md (copy-paste message template)

## Epic 14 - Polish and hardening

- [ ] Accessibility pass completed (keyboard nav, screen reader, contrast audit)
- [ ] Responsive polish completed (mobile sidebar, table overflow, chart scaling)
- [ ] Error boundaries on all major pages
- [ ] Loading skeletons on all data-dependent pages
- [ ] Favicon and metadata (title, description, og:image)
- [ ] Console warnings cleaned up
- [ ] Main flow e2e test added (Playwright: login → dashboard → patient → summary)

## Epic 15 - Supabase Auth (implemented)

- [x] Supabase Auth integration (@supabase/ssr + @supabase/supabase-js)
- [x] Login page with email/password (EN/FR, dark/light, demo account hints)
- [x] Session management via Supabase SSR cookies
- [x] Protected routes with middleware (redirect to login if unauthenticated)
- [x] Logout flow (POST /api/auth/logout)
- [x] Actor resolution from Supabase session in all API routes + audit events
- [x] Seed emails updated to match Supabase demo accounts
- [x] AppShell conditional: login page renders without sidebar/header
- [ ] Supabase project provisioned with demo accounts seeded
- [ ] Password reset flow (future)

## Acceptance criteria pattern

For each completed item:

- code exists
- tests added or updated
- docs updated
- backlog updated
- manual checks updated
- verification commands run
- works in hosted environment (for Epic 13+)
