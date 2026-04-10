# Release Checklist

## Pre-release (code quality)

- [ ] All backlog items for this release are marked done
- [ ] All tests pass (`pnpm test`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Type check passes (`pnpm typecheck`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Manual checks for the relevant stage(s) have been performed
- [ ] EN locale verified on all changed surfaces
- [ ] FR locale verified on all changed surfaces
- [ ] Light mode verified on all changed surfaces
- [ ] Dark mode verified on all changed surfaces
- [ ] No hardcoded untranslated strings in UI code
- [ ] No hardcoded color values where semantic tokens exist
- [ ] Accessibility baseline considered (keyboard nav, focus, contrast)
- [ ] Decision log updated if architectural decisions were made
- [ ] README reflects current state

## Pre-release (deployment readiness)

- [ ] No hardcoded localhost URLs in committed code
- [ ] No secrets committed (DATABASE_URL, API keys in .env only)
- [ ] `.env.example` reflects all required env vars
- [ ] `prisma migrate deploy` or `db:push` runs cleanly against production DB
- [ ] Seed script runs successfully and is idempotent
- [ ] Health check endpoint returns `{ status: 'ok', dbConnected: true }`
- [ ] Build succeeds in production mode with production env vars
- [ ] No `console.log` in production code paths (use `console.error` for errors only)

## Post-deploy verification

- [ ] App is accessible at public URL
- [ ] `/api/health` returns ok with dbConnected: true
- [ ] Dashboard loads with seeded patient data
- [ ] Patient detail page loads with glucose chart
- [ ] EN/FR switching works on hosted environment
- [ ] Light/dark switching works on hosted environment
- [ ] Audit trail shows events
- [ ] No console errors in browser devtools
- [ ] Seed data produces credible patient stories
- [ ] Backlog updated with follow-up items if any
