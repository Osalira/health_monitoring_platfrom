# T1D Command Center

A production-minded, clinician-first platform for proactive type 1 diabetes care.

## Product direction

This project demonstrates a modern healthcare platform that:

- ingests heterogeneous diabetes-related data
- supports clinician workflows
- prioritizes patients by risk
- generates explainable summaries
- maintains auditability and operational maturity
- supports English/French and light/dark mode from day one

## Monorepo goals

- pnpm workspace
- Next.js web application
- modular-monolith backend boundaries
- shared packages
- strong engineering conventions
- high test quality
- demo-ready seeded synthetic data

## Core user journeys

- Clinician Monday Morning Review
- Open Patient Chart
- Review patient trends and risk factors
- Generate visit prep summary
- Review audit trail
- Manage tasks and outreach

## Repository structure

```
apps/
  web-clinician/    # clinician-facing Next.js app
  web-patient/      # patient-facing shell (future)
  api/              # API and domain orchestration
  worker/           # background processing

packages/
  ui/               # shared UI primitives
  config/           # shared configuration
  types/            # shared TypeScript types
  i18n/             # localization dictionaries and utilities
  database/         # Prisma schema, client, and migrations
  auth/             # mock auth and role helpers
  observability/    # structured logging and health checks
  synthetic-data/   # synthetic patient and event generators
  risk-engine/      # risk scoring and explainability
  summary-engine/   # visit prep summary generation
  fhir-model/       # FHIR-aligned type helpers

docs/               # source-of-truth documentation
scripts/            # seed, demo data, and utility scripts
infra/              # Docker, CI, and deployment config
```

## Commands

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Lint

```bash
pnpm lint
```

### Type check

```bash
pnpm typecheck
```

### Test

```bash
pnpm test
```

### Build

```bash
pnpm build
```

### Format

```bash
pnpm format
```

## Documentation

All source-of-truth documentation lives under `docs/`:

- `docs/product/` — PRD, backlog, roadmap, demo script
- `docs/architecture/` — system design, domain model, frontend/backend architecture
- `docs/engineering/` — tech stack, conventions, definition of done, decision log
- `docs/ux/` — design principles, copy guidelines, manual checks
- `docs/qa/` — test matrix, release checklist
