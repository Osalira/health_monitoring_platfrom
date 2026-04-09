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

- [ ] Tailwind configured
- [ ] Semantic theme tokens established
- [ ] Dark mode support implemented
- [ ] Locale infrastructure added
- [ ] EN dictionary added
- [ ] FR dictionary added
- [ ] Theme toggle implemented
- [ ] Locale switcher implemented
- [ ] Shared UI primitives created
- [ ] Accessibility baseline added

## Epic 4 - App shell and auth mock

- [ ] App shell created
- [ ] Route structure created
- [ ] Mock auth/session layer added
- [ ] Role model helpers added
- [ ] Route guard strategy added
- [ ] Header/navigation added
- [ ] Loading/empty/error states added

## Epic 5 - Database and domain implementation

- [ ] Prisma configured
- [ ] PostgreSQL connected
- [ ] Core entities modeled
- [ ] Migrations working
- [ ] Seed entrypoints added
- [ ] Database package established

## Epic 6 - Synthetic data system

- [ ] Patient generator added
- [ ] Device/event generation added
- [ ] Archetypes documented
- [ ] Deterministic seed support added
- [ ] Seed pipeline populates credible data

## Epic 7 - Clinician dashboard

- [ ] KPI cards implemented
- [ ] Patient roster implemented
- [ ] Filtering/search added
- [ ] Sync status added
- [ ] Risk display integrated
- [ ] Loading/error/empty states complete

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
