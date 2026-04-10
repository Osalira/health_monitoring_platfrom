# T1D Command Center

A production-minded, clinician-first platform for proactive type 1 diabetes care.

> **All data is synthetic.** No real patient information exists in this system.

## Live Demo

<!-- Update with actual URL after deployment -->
**URL:** `https://t1d-command-center.vercel.app`

**Demo accounts:**

| Role | Email | Password |
|------|-------|----------|
| Clinician | `clinician@t1d-demo.app` | `demo-clinician-2026` |
| Educator | `educator@t1d-demo.app` | `demo-educator-2026` |
| Admin | `admin@t1d-demo.app` | `demo-admin-2026` |

## What it does

- **Population dashboard** — KPI cards, patient roster with risk tiers, search/filter
- **Patient detail** — Glucose chart (7/14/30d), insulin/meals/activity/labs, risk explanation
- **Risk scoring** — Explainable 6-factor heuristic with localized labels and descriptions
- **Visit prep summaries** — Structured facts/trends/discussion with provenance citations
- **Care coordination** — Task creation/assignment, alert management, outreach logging
- **Audit trail** — Every action logged with actor, timestamp, resource
- **Bilingual** — Full English and French support
- **Dark mode** — Complete light/dark theme support

## Tech stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts
- **Database:** PostgreSQL (Supabase), Prisma ORM
- **Auth:** Supabase Auth (email/password)
- **Monorepo:** pnpm workspaces, Turborepo
- **Testing:** Vitest (109 tests across 7 packages)

## Local development

### Prerequisites

- Node.js 20+
- pnpm 10+
- Docker (for local Postgres) or a Supabase project

### Setup

```bash
# Install dependencies
pnpm install

# Option A: Local Postgres via Docker
docker compose up -d
cp .env.example .env
# Edit .env with local DATABASE_URL

# Option B: Supabase Postgres
# Copy your Supabase DATABASE_URL and auth keys to .env

# Push schema and seed data
pnpm --filter @t1d/database db:generate
pnpm --filter @t1d/database db:push
pnpm --filter @t1d/database db:seed

# Start dev server
pnpm dev
# Visit http://localhost:3000
```

### Quality gates

```bash
pnpm lint        # ESLint across all packages
pnpm typecheck   # TypeScript strict mode
pnpm test        # Vitest (109 tests)
pnpm build       # Production build
```

## Deployment (Vercel + Supabase)

1. **Supabase:** Create project, get DATABASE_URL + API keys
2. **Supabase Auth:** Create demo users (see table above), disable email confirmation
3. **Vercel:** Import repo, set env vars (DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
4. **Post-deploy:** Push schema + seed via CLI or Vercel script
5. **Verify:** Check `/api/health` returns `{ status: 'ok' }`

## Architecture

```
apps/web-clinician (Next.js)  →  Supabase Postgres
                              →  Supabase Auth
```

Single deployable. API routes handle ingestion, metrics, tasks, alerts, summaries, audit.

## Documentation

All source-of-truth docs live under `docs/`:

- `docs/product/` — PRD, backlog, roadmap
- `docs/architecture/` — system design, domain model, deployment
- `docs/engineering/` — tech stack, conventions, decision log
- `docs/ux/` — manual checks, design principles
- `docs/qa/` — test matrix, release checklist
