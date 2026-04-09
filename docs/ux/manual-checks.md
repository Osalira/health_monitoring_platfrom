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
  1. Start the app
  2. Open the default route in English
- Expected result:
  - Navigation, headings, and controls display in English

### Check 2 - French locale renders

- What to check: French locale displays correctly
- How to check:
  1. Switch locale to French
  2. Review shell and sample page
- Expected result:
  - Navigation, headings, controls, and empty states display in French
  - No visible mixed untranslated English copy

### Check 3 - Light and dark mode render correctly

- What to check: Theme switching works
- How to check:
  1. Toggle theme in the app shell
  2. Refresh the page
  3. Review buttons, cards, text, tables, and focus styles
- Expected result:
  - Theme changes successfully
  - Theme persists or behaves as documented
  - No unreadable contrast or broken UI appears

## Stage 4 - App shell

### Check 1 - Route shell and navigation

- What to check: App shell and navigation work
- How to check:
  1. Open the clinician app
  2. Navigate across the available shell routes
- Expected result:
  - Navigation is clear and accessible
  - Header contains locale and theme controls
  - Loading and empty states render properly
