# Deployment Guide — Vercel + Supabase

## Prerequisites

- GitHub repo pushed to remote
- Supabase project created (https://supabase.com)
- Vercel account (https://vercel.com)

## Step 1: Supabase Setup

### Database

Your Supabase project is: `dzluoymaqvmgctybfreq`

Connection string (from Settings → Database):
```
postgresql://postgres:[YOUR-PASSWORD]@db.dzluoymaqvmgctybfreq.supabase.co:5432/postgres
```

### Auth Users

Create 3 users in **Authentication → Users → Add User** (with "Auto confirm" ON):

| Email | Password |
|-------|----------|
| `clinician@t1d-demo.app` | `demo-clinician-2026` |
| `educator@t1d-demo.app` | `demo-educator-2026` |
| `admin@t1d-demo.app` | `demo-admin-2026` |

**Important:** Go to **Authentication → Providers → Email** and disable "Confirm email".

### API Keys

From **Settings → API**, copy:
- Project URL: `https://dzluoymaqvmgctybfreq.supabase.co`
- Publishable key: `sb_publishable_...` (or anon key starting with `eyJ...`)

## Step 2: Schema + Seed

From your local machine (with the Supabase DATABASE_URL in `packages/database/.env`):

```bash
# Push schema to Supabase
pnpm --filter @t1d/database db:push

# Seed synthetic data (30 patients, ~178K observations)
pnpm --filter @t1d/database db:seed
```

This takes ~90 seconds. Output should show:
```
Users: 3
Patients: 30
Devices: 48
Observations: 178468
Alerts: 60
Tasks: 96
Risk Assessments: 30
Consent Records: 90
```

## Step 3: Vercel Deployment

### Import Project

1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Set **Root Directory** to `apps/web-clinician`
4. Framework: **Next.js** (auto-detected)
5. Build Command: Override with:
   ```
   cd ../.. && pnpm --filter @t1d/database db:generate && pnpm --filter @t1d/web-clinician build
   ```
6. Install Command: Override with:
   ```
   cd ../.. && pnpm install
   ```

### Environment Variables

Add these in Vercel → Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.dzluoymaqvmgctybfreq.supabase.co:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dzluoymaqvmgctybfreq.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your publishable key |

### Deploy

Click **Deploy**. First build takes ~2 minutes.

## Step 4: Post-Deploy Verification

1. **Health check:** `curl https://[your-app].vercel.app/api/health`
   - Expect: `{ "status": "ok", "database": { "connected": true } }`

2. **Login:** Visit the app URL → login page should appear
   - Sign in with `clinician@t1d-demo.app` / `demo-clinician-2026`

3. **Dashboard:** 4 KPI cards with non-zero values, patient roster with 30 patients

4. **Patient detail:** Click any patient → glucose chart, tasks, alerts, risk explanation

5. **Locale:** Switch to French → all text localizes

6. **Theme:** Toggle dark mode → all components render correctly

7. **Tasks/Alerts:** Click KPI cards → navigate to /tasks and /alerts pages

8. **Audit trail:** Visit /audit → shows logged events

## Sharing with Reviewers

Send this message:

> **T1D Command Center — Healthcare Platform MVP**
>
> URL: https://[your-app].vercel.app
>
> Sign in with: `clinician@t1d-demo.app` / `demo-clinician-2026`
>
> This is a clinician-first T1D management platform with:
> - Population dashboard with risk-prioritized patient roster
> - Patient detail with glucose charts, risk scoring, and care coordination
> - Visit prep summary generation with provenance citations
> - Full English/French support and dark mode
> - Audit trail for all actions
>
> All data is synthetic. Try clicking patients, creating tasks, generating summaries, and switching locale/theme.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Check Vercel build logs. Ensure `db:generate` runs before `build`. |
| 500 on pages | Check `/api/health`. If DB not connected, verify `DATABASE_URL`. |
| Login fails | Verify Supabase auth users exist and email confirmation is disabled. |
| No patients | Re-run `pnpm --filter @t1d/database db:seed` locally against Supabase DB. |
| Stale data | Seed is idempotent — safe to re-run anytime. |
