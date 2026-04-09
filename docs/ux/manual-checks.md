# Manual Checks

## Stage 1 - Documentation and planning

### Check 1
- What to check: Source-of-truth docs exist
- How to check:
  1. Open docs/product, docs/architecture, docs/engineering, docs/ux, and docs/qa
  2. Confirm required markdown files are present
- Expected result:
  - All required documentation files exist
  - Files are coherent and implementation-ready

## Stage 2 - Workspace and tooling

### Check 1
- What to check: Workspace installs successfully
- How to check:
  1. Run `pnpm install`
- Expected result:
  - Install completes without dependency or workspace errors

### Check 2
- What to check: Root scripts work
- How to check:
  1. Run `pnpm lint`
  2. Run `pnpm typecheck`
  3. Run `pnpm test`
  4. Run `pnpm build`
- Expected result:
  - Commands are recognized
  - Commands complete successfully or clearly indicate minimal expected placeholders

## Stage 3 - Theming and localization foundation

### Check 1
- What to check: English locale renders
- How to check:
  1. Start the app
  2. Open the default route in English
- Expected result:
  - Navigation, headings, and controls display in English

### Check 2
- What to check: French locale renders
- How to check:
  1. Switch locale to French
  2. Review shell and sample page
- Expected result:
  - Navigation, headings, controls, and empty states display in French
  - No visible mixed untranslated English copy

### Check 3
- What to check: Light and dark mode render correctly
- How to check:
  1. Toggle theme in the app shell
  2. Refresh the page
  3. Review buttons, cards, text, tables, and focus styles
- Expected result:
  - Theme changes successfully
  - Theme persists or behaves as documented
  - No unreadable contrast or broken UI appears

## Stage 4 - App shell

### Check 1
- What to check: Route shell and navigation
- How to check:
  1. Open the clinician app
  2. Navigate across the available shell routes
- Expected result:
  - Navigation is clear and accessible
  - Header contains locale and theme controls
  - Loading and empty states render properly