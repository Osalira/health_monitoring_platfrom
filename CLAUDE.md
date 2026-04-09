# Claude Working Agreement

Always read these files before making changes:
- docs/product/prd.md
- docs/product/backlog.md
- docs/architecture/000-overview.md
- docs/architecture/001-system-design.md
- docs/architecture/002-domain-model.md
- docs/engineering/tech-stack.md
- docs/engineering/conventions.md
- docs/engineering/definition-of-done.md
- docs/ux/manual-checks.md
- docs/qa/test-matrix.md

Project priorities:
1. Clinician-first workflow
2. Bilingual support (English and French)
3. Light and dark mode support
4. Clean architecture
5. Accessibility
6. Testability
7. Maintainability

Non-negotiable rules:
- All user-facing strings must be localized.
- All UI must support light and dark mode.
- Do not hardcode untranslated strings in JSX/TSX.
- Do not hardcode one-off colors when semantic tokens exist.
- Prefer boring, maintainable solutions over cleverness.
- Keep implementation aligned with the documented architecture.
- Update backlog and manual checks after each stage.
- Add tests for changed behavior.
- If a decision changes architecture or conventions, update docs/engineering/decision-log.md.

Expected workflow for each task:
1. Read source-of-truth docs.
2. Restate task scope.
3. Implement only the scoped work.
4. Add/update tests.
5. Update backlog and manual checks.
6. Run verification commands.
7. Summarize changes, risks, and follow-ups.