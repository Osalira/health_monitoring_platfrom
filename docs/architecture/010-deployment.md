# Deployment

## Environments

### Local development
- Docker Compose for Postgres (port 5452) and Redis (port 6379)
- `pnpm dev` runs Next.js on localhost:3000
- `.env` with local DATABASE_URL
- `db:push` + `db:seed` for schema and synthetic data

### Preview (per-PR)
- Vercel preview deployments or equivalent
- Ephemeral database per preview (or shared staging DB)
- Seed runs automatically on deploy or via manual trigger
- Used for PR review and stakeholder demos

### Production
- Vercel (or similar) for Next.js hosting
- Managed PostgreSQL (Neon, Supabase, Railway, or equivalent)
- Environment variables managed via hosting platform
- Migrations applied before deploy via CI
- Seed script idempotent — safe to re-run

## Deployment architecture

```
┌─────────────────────────────────────────┐
│           Vercel / Hosting Platform     │
│  ┌───────────────────────────────────┐  │
│  │   apps/web-clinician (Next.js)    │  │
│  │   - SSR pages                     │  │
│  │   - API routes (/api/*)           │  │
│  │   - Static assets                 │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           │
           │ DATABASE_URL
           ▼
┌─────────────────────┐
│  Managed PostgreSQL  │
│  (Neon / Supabase)   │
└─────────────────────┘
```

For MVP, the Next.js app handles everything: SSR, API routes, and background-style work (compute-metrics). No separate API or worker service needed yet.

## Auth strategy for hosted MVP

- **Supabase Auth** with email/password login
- 3 pre-seeded demo accounts: clinician, educator, admin
- Middleware redirects unauthenticated users to `/login`
- Login page shows demo credential hints for easy access
- Supabase user email maps to app User record for role resolution
- Logout clears Supabase session via POST /api/auth/logout
- Cookie-based session managed by `@supabase/ssr`

## Seed strategy for hosted environments

1. Schema: `prisma db push` (or `prisma migrate deploy` for migration-based)
2. Seed: `prisma db seed` — idempotent via upserts on unique keys
3. Seed produces 30 synthetic patients with full clinical data
4. Seed is safe to re-run (does not duplicate data)
5. For hosted: seed runs as a post-deploy step or manual trigger

## Database migration strategy

- Development: `prisma db push` for rapid iteration
- Production: `prisma migrate deploy` from committed migration files
- Migration files committed to `packages/database/prisma/migrations/`
- CI runs `prisma migrate deploy` before app starts

## Environment variables

| Variable | Local | Production | Description |
|----------|-------|------------|-------------|
| `DATABASE_URL` | `postgresql://...localhost:5452/...` | `postgresql://postgres:...@db.dzluoymaqvmgctybfreq.supabase.co:5432/postgres` | PostgreSQL connection |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dzluoymaqvmgctybfreq.supabase.co` | Same | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | From Supabase dashboard | Same | Supabase publishable key |
| `NODE_ENV` | `development` | `production` | Runtime environment |

## CI/CD pipeline

1. Push to branch → GitHub Actions runs lint, typecheck, test, build
2. PR merge to main → deploy to production
3. Post-deploy: run migrations, optionally re-seed
4. Health check: `GET /api/health` returns `{ status: 'ok', dbConnected: true }`

## Operational expectations

### Health checks
- `GET /api/health` — returns status + DB connectivity + timestamp
- Hosting platform pings this for uptime monitoring

### Logging
- Structured `console.error` with context tags in all API routes
- Vercel / hosting captures stdout/stderr automatically
- No external logging service needed for MVP

### Runbook

| Issue | Action |
|-------|--------|
| App returns 500 | Check `/api/health`, check DB connectivity |
| DB connection fails | Verify `DATABASE_URL`, check managed DB dashboard |
| Stale data | Re-run `prisma db seed` via deployment script |
| Schema drift | Run `prisma migrate deploy` |
| Build fails | Check CI logs, run `pnpm build` locally |

## Principles

- Simple first — one deployable, one database
- Repeatable setup — seed is deterministic and idempotent
- Production-minded structure — migrations, health checks, env separation
- Observability hooks included — health endpoint, structured logging
