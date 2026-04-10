# Release Notes — T1D Command Center MVP

**Version:** 0.1.0
**Date:** April 2026
**Status:** Hosted MVP with synthetic data

---

## Capabilities

### Clinician Dashboard
- 4 interactive KPI cards (Total Patients, High Risk, Pending Tasks, Active Alerts)
- Patient roster with search, risk tier filter, pagination
- Each KPI links to the relevant detail page

### Patient Detail
- Patient header with demographics, devices, HbA1c, risk badge, consent markers
- Glucose chart with 7/14/30-day time range selector (Recharts, dark-mode aware)
- Recent events: insulin, meals, activity, labs
- Explainable risk assessment with 6 localized factors + descriptions
- Visit prep summary with facts/trends/discussion and provenance citations (EN/FR)
- Task panel with create, assign, start/complete/cancel actions
- Alert panel with acknowledge/resolve/dismiss actions
- Outreach log with contact type selection

### Cross-Patient Views
- `/tasks` — All open tasks across patients with priority, assignee, due date
- `/alerts` — All active alerts across patients with severity, explanation
- `/audit` — Full audit trail with actor, action, resource, timestamp

### Infrastructure
- Supabase Auth (email/password, 3 demo accounts)
- Health check at `/api/health` (DB connectivity, latency, version, uptime)
- Ingestion API at `/api/ingest` (Zod validation, idempotency, raw payload storage)
- Metrics computation at `/api/compute-metrics`
- Environment validation on startup

### Bilingual + Theming
- Complete English and French localization
- Full light/dark mode support
- Accessible keyboard navigation

---

## Synthetic Data

- 30 patients across 5 archetypes:
  - Well-Controlled (6) — low risk, stable
  - Declining (6) — rising glucose, moderate risk
  - High-Risk (6) — poor TIR, critical risk
  - Newly Diagnosed (6) — sparse data, short history
  - Non-Adherent (6) — CGM gaps, device disconnects
- ~178,000 observations (glucose, insulin, carbs, activity, labs)
- 60 alerts, 96 tasks, 30 risk assessments, 90 consent records
- Deterministic generation (same seed = same data)

---

## Known Limitations

1. **Auth is demo-only** — Email/password with pre-seeded accounts. No registration, no password reset.
2. **No real data integrations** — All data is synthetic. No EMR, CGM vendor, or lab integrations.
3. **Summary generation is template-based** — No LLM. Structured templates with interpolated data.
4. **Risk scoring is heuristic** — 6-factor weighted formula, not ML. Designed for explainability.
5. **No HIPAA compliance** — Synthetic data only. Not suitable for real patient data.
6. **No Prisma migrations committed** — Using `db:push` for schema sync. Formal migrations needed before multi-environment production.
7. **Audit events don't cover all reads** — Only patient detail access and write operations are audited.
8. **No real-time updates** — Data refreshes on page navigation, not via WebSocket/SSE.

---

## Test Coverage

- **109 unit tests** across 7 packages
- Format helpers, risk engine, synthetic data generators, ingestion validation, summary composition, UI components, auth helpers
- All quality gates pass: lint, typecheck, test, build (14/14 Turborepo tasks)
