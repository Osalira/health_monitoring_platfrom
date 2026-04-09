# Manual Checks

## Stage 1 - Documentation and planning

### Check 1 - Source-of-truth docs exist

- What to check: All required documentation files are present and coherent
- How to check:
  1. Open `docs/product/` and confirm: prd.md, backlog.md, roadmap.md, demo-script.md
  2. Open `docs/architecture/` and confirm: 000-overview.md through 010-deployment.md
  3. Open `docs/engineering/` and confirm: tech-stack.md, conventions.md, definition-of-done.md, decision-log.md, adr-template.md
  4. Open `docs/ux/` and confirm: manual-checks.md, design-principles.md, copy-guidelines.md
  5. Open `docs/qa/` and confirm: test-matrix.md, release-checklist.md
- Expected result:
  - All files exist
  - Each file has meaningful, implementation-ready content
  - No placeholder-only files among the required set

### Check 2 - Docs are internally consistent

- What to check: Directory structure in system design matches actual scaffold
- How to check:
  1. Compare `docs/architecture/001-system-design.md` directory listing against `ls apps/ packages/`
  2. Verify README repository structure section matches
- Expected result:
  - Documented structure matches actual directories
  - No orphaned directories that aren't in docs
  - No documented directories that don't exist

### Check 3 - README is complete

- What to check: README has project purpose, structure, and all root commands
- How to check:
  1. Open README.md
  2. Verify sections: product direction, repository structure, commands, documentation
- Expected result:
  - README covers purpose, structure, commands (install, dev, lint, typecheck, test, build, format)
  - Documentation section points to docs/

### Check 4 - Backlog reflects current state

- What to check: Epic 1 items are marked done, remaining epics are not started
- How to check:
  1. Open `docs/product/backlog.md`
  2. Verify Epic 1 items are `[x]`
  3. Verify Epic 2+ items are `[ ]` or `[~]` as appropriate
- Expected result:
  - Epic 1 fully checked off
  - Epic 2 partially in-progress (scaffold exists)
  - Epics 3-13 not started

### Check 5 - Decision log has entries

- What to check: Decision log captures foundational decisions
- How to check:
  1. Open `docs/engineering/decision-log.md`
  2. Review entries
- Expected result:
  - At least: architecture direction, app separation, docs-first approach
  - Each entry has status, decision, why, and consequences

## Stage 2 - Workspace and tooling

### Check 1 - Workspace installs successfully

- What to check: pnpm install works with all 16 workspace projects
- How to check:
  1. Delete `node_modules` and run `pnpm install`
- Expected result:
  - Install completes without dependency or workspace errors
  - All 16 workspace projects are recognized (15 packages + root)

### Check 2 - Root scripts work

- What to check: All quality gate scripts pass
- How to check:
  1. Run `pnpm lint` — ESLint runs across all 14 packages with scripts
  2. Run `pnpm typecheck` — TypeScript strict mode passes in all packages
  3. Run `pnpm test` — Vitest runs in @t1d/i18n, stubs pass elsewhere
  4. Run `pnpm build` — TypeScript compilation succeeds in all packages
- Expected result:
  - All 4 commands complete with 14/14 tasks successful
  - No lint errors, no type errors, all tests pass

### Check 3 - Workspace members are properly structured

- What to check: Each app and package has required files
- How to check:
  1. Verify each dir in `apps/` and `packages/` (except config) has: package.json, tsconfig.json, src/index.ts
  2. Verify package names follow `@t1d/` scope convention
  3. Verify each package.json has lint, typecheck, test, and build scripts
- Expected result:
  - All 14 workspace members have consistent structure
  - Scripts are wired and callable via Turborepo

### Check 4 - ESLint config works

- What to check: ESLint flat config catches violations
- How to check:
  1. Add `let x: any = 1;` to any `src/index.ts`
  2. Run `pnpm lint`
  3. Verify lint fails with `@typescript-eslint/no-explicit-any`
  4. Revert the change
- Expected result:
  - ESLint catches `any` usage and unused variables
  - eslint-config-prettier prevents formatting conflicts

### Check 5 - CI workflow exists

- What to check: GitHub Actions CI configuration is valid
- How to check:
  1. Open `.github/workflows/ci.yml`
  2. Verify it runs lint, typecheck, test, and build
  3. Verify it triggers on push/PR to main and master
- Expected result:
  - CI workflow uses pnpm/action-setup and actions/setup-node
  - All 4 quality gates are present
  - Concurrency group prevents duplicate runs

### Check 6 - Environment handling

- What to check: .env.example documents required env vars
- How to check:
  1. Open `.env.example`
  2. Verify DATABASE_URL, REDIS_URL, auth, and locale vars are documented
- Expected result:
  - All expected env vars are listed with descriptions or defaults
  - .env and .env.local are in .gitignore

## Stage 3 - Theming and localization foundation

### Check 1 - English locale renders

- What to check: Default English locale displays correctly
- How to check:
  1. Run `pnpm --filter @t1d/web-clinician dev`
  2. Open `http://localhost:3000` (redirects to `/en`)
  3. Review dashboard page: header title, subtitle, description, KPI cards
- Expected result:
  - All text displays in English
  - Header shows "T1D Command Center"
  - KPI cards show "Total Patients", "High Risk", "Pending Tasks", "Recent Alerts"
  - No untranslated keys visible (no `dashboard.title` raw keys)

### Check 2 - French locale renders

- What to check: French locale displays correctly
- How to check:
  1. Click the language icon (globe) in the header
  2. Select "Français"
  3. URL changes to `/fr`
  4. Review all visible text
- Expected result:
  - Header shows "Centre de contrôle DT1"
  - KPI cards show "Total patients", "Risque élevé", "Tâches en attente", "Alertes récentes"
  - No visible mixed untranslated English copy
  - Description text is fully in French

### Check 3 - Light and dark mode render correctly

- What to check: Theme switching works and persists
- How to check:
  1. Click the sun/moon icon in the header
  2. Select "Dark" — page background changes to dark blue-black
  3. Select "Light" — page background changes to white
  4. Select "System" — follows OS preference
  5. Refresh the page — theme persists
  6. Review: header, cards, badges, text contrast
- Expected result:
  - Theme changes immediately (no flash on toggle)
  - All text remains readable in both themes
  - Cards, badges, borders all use appropriate colors
  - No hardcoded colors breaking in dark mode

### Check 4 - Theme and locale controls are accessible

- What to check: Controls work with keyboard
- How to check:
  1. Tab to the language switcher — should show focus ring
  2. Press Enter/Space — dropdown opens
  3. Arrow keys navigate options
  4. Enter selects
  5. Repeat for theme toggle
- Expected result:
  - Visible focus indicators on all interactive elements
  - Dropdown menus open/close with keyboard
  - `aria-label` present on icon-only buttons ("Toggle theme", "Switch language")

### Check 5 - UI primitives render in both themes

- What to check: Shared components from @t1d/ui work correctly
- How to check:
  1. In light mode, inspect KPI cards — border visible, text readable
  2. Switch to dark mode — cards have dark background, light text
  3. Check badges — contrast sufficient in both themes
- Expected result:
  - All semantic token-based components adapt automatically
  - No broken or invisible elements in either theme

### Check 6 - Quality gates pass

- What to check: All CI-equivalent commands pass
- How to check:
  1. `pnpm lint` — 14/14
  2. `pnpm typecheck` — 14/14
  3. `pnpm test` — 14/14 (13 real tests: 10 UI + 3 i18n)
  4. `pnpm build` — 14/14 (Next.js builds with SSG)
- Expected result:
  - Zero errors across all commands

## Stage 4 - App shell and auth mock

### Check 1 - App shell renders with sidebar navigation

- What to check: Sidebar navigation displays and works on desktop
- How to check:
  1. Run `pnpm --filter @t1d/web-clinician dev`
  2. Open `http://localhost:3000` (redirects to `/en`)
  3. Verify left sidebar shows: Dashboard, Patients, Settings
  4. Click each nav item — URL and content change
  5. Active nav item is highlighted
- Expected result:
  - Sidebar is visible on desktop, hidden on mobile
  - Active page is visually indicated
  - All nav labels are localized

### Check 2 - Mobile navigation works

- What to check: Mobile nav bar displays on small viewports
- How to check:
  1. Resize browser to mobile width (< 768px)
  2. Sidebar disappears, horizontal nav bar appears below header
  3. Nav items are accessible
- Expected result:
  - Mobile nav shows icons with labels on small screens
  - Navigation works correctly

### Check 3 - User menu and role switching

- What to check: Demo user switcher works
- How to check:
  1. Click the user icon in the header
  2. See dropdown with all 5 demo users (Dr. Chen, Marc Dupont, Admin, Alex, Julie)
  3. Each shows name and localized role
  4. Select a different user
  5. Header updates to show new user name and role badge
- Expected result:
  - User switches immediately
  - Role badge updates
  - Preference persists on page refresh (cookie-based)

### Check 4 - Route structure works

- What to check: All routes render correctly
- How to check:
  1. Visit `/en` — Dashboard with KPI cards
  2. Visit `/en/patients` — Patients page with empty state
  3. Visit `/en/patients/test-123` — Patient detail placeholder
  4. Visit `/en/settings` — Settings page
  5. Visit `/en/nonexistent` — 404 page
- Expected result:
  - Each page has localized title and content
  - Empty states are informative
  - 404 shows localized message with back-to-dashboard link

### Check 5 - All text localized in both locales

- What to check: Switching to French localizes all new text
- How to check:
  1. Switch to French via locale switcher
  2. Check sidebar: "Tableau de bord", "Patients", "Paramètres"
  3. Check user menu: role shows "Clinicien", "Éducateur", etc.
  4. Check error/empty states in French
  5. Check "Mode démo" badge
- Expected result:
  - Zero English strings visible when in French locale
  - Role names, nav items, page titles, empty states all in French

### Check 6 - Dark mode works across shell

- What to check: All new shell UI renders correctly in dark mode
- How to check:
  1. Toggle to dark mode
  2. Check sidebar background and borders
  3. Check header, user menu dropdown, nav active state
  4. Check empty state cards
- Expected result:
  - All elements use semantic tokens
  - No broken contrast or invisible text

### Check 7 - Keyboard accessibility

- What to check: Shell navigation is keyboard accessible
- How to check:
  1. Tab through sidebar nav items — focus rings visible
  2. Tab to user menu — Enter opens dropdown
  3. Arrow through users — Enter selects
  4. Tab to locale/theme controls — same behavior
- Expected result:
  - All interactive elements have visible focus indicators
  - Dropdowns navigable with keyboard

### Check 8 - Quality gates pass

- What to check: All CI-equivalent commands pass
- How to check:
  1. `pnpm lint` — 14/14
  2. `pnpm typecheck` — 14/14
  3. `pnpm test` — 14/14 (28 real tests: 15 auth + 10 UI + 3 i18n)
  4. `pnpm build` — 14/14
- Expected result:
  - Zero errors across all commands

## Stage 5 - Database and domain implementation

### Check 1 - Prisma schema is valid

- What to check: Schema parses without errors
- How to check:
  1. Run `pnpm --filter @t1d/database db:generate`
- Expected result:
  - Prisma client generates successfully
  - No schema validation errors

### Check 2 - All 10 core entities are modeled

- What to check: Schema contains all documented entities
- How to check:
  1. Open `packages/database/prisma/schema.prisma`
  2. Verify models: User, Patient, Device, Observation, Task, Alert, RiskAssessment, GeneratedSummary, AuditEvent, ConsentRecord
  3. Verify enums: UserRole, DeviceType, DeviceStatus, ObservationType, TaskStatus, TaskPriority, AlertSeverity, AlertStatus, RiskTier, SummaryKind, AuditAction, ConsentType, ConsentStatus
- Expected result:
  - All 10 models present with documented fields
  - 13 enums matching domain requirements
  - Proper relations and foreign keys

### Check 3 - Database client exports work

- What to check: Package exports are correct
- How to check:
  1. Run `pnpm --filter @t1d/database test`
- Expected result:
  - 3 tests pass: PrismaClient export, singleton instance, singleton identity

### Check 4 - Migration readiness (requires Postgres)

- What to check: Schema can be pushed to a real database
- How to check:
  1. Start a local PostgreSQL instance
  2. Set `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/t1d_command_center`
  3. Run `pnpm --filter @t1d/database db:push`
  4. Run `pnpm --filter @t1d/database db:seed`
- Expected result:
  - Schema pushes cleanly
  - Seed creates 3 users, 30 patients, ~60 devices, ~270K observations
  - `pnpm --filter @t1d/database db:studio` shows populated tables

### Check 5 - Quality gates pass

- What to check: All CI commands pass with database package
- How to check:
  1. `pnpm lint` — 14/14
  2. `pnpm typecheck` — 14/14
  3. `pnpm test` — 14/14 (51 real tests: 15 auth + 10 UI + 3 i18n + 3 database + 20 synthetic-data)
  4. `pnpm build` — 14/14
- Expected result:
  - Zero errors across all commands

## Stage 6 - Synthetic data system

### Check 1 - Generators produce deterministic output

- What to check: Same seed produces same data
- How to check:
  1. Run `pnpm --filter @t1d/synthetic-data test`
  2. Look for RNG determinism and pipeline determinism tests
- Expected result:
  - 20 tests pass across 4 test files (rng, patient, glucose, pipeline)
  - Same seed + index produces identical patient names, glucose values, risk scores

### Check 2 - Archetypes produce distinct clinical stories

- What to check: Each archetype generates visibly different data
- How to check:
  1. Check pipeline test "archetype drives data characteristics"
  2. Well-controlled: LOW risk, 0 alerts, 1 task
  3. High-risk: CRITICAL risk, 4 alerts, 5 tasks
  4. Non-adherent: fewer glucose readings (45% coverage)
- Expected result:
  - Archetypes differ in glucose count, alert count, risk tier

### Check 3 - Glucose readings are physiologically plausible

- What to check: Values stay in realistic range
- How to check:
  1. Check glucose test "glucose values stay in physiological range"
  2. All values must be 40-400 mg/dL
- Expected result:
  - No values outside 40-400 mg/dL across any archetype

### Check 4 - Seed pipeline creates complete dataset (requires Postgres)

- What to check: Full seed runs and populates all tables
- How to check:
  1. Run `pnpm --filter @t1d/database db:push && pnpm --filter @t1d/database db:seed`
  2. Check console output for counts
- Expected result:
  - 3 users, 30 patients, ~60 devices
  - ~270K observations (glucose + insulin + meals + activity + labs)
  - 30 risk assessments
  - Multiple alerts and tasks per high-risk patients

### Check 5 - Quality gates pass

- What to check: All commands pass
- How to check:
  1. `pnpm lint` — 14/14
  2. `pnpm typecheck` — 14/14
  3. `pnpm test` — 14/14 (51 real tests)
  4. `pnpm build` — 14/14
- Expected result:
  - Zero errors across all commands
