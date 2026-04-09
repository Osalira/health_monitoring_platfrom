# Release Checklist

## Pre-release

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

## Post-release

- [ ] Demo flow runs end-to-end without errors
- [ ] Seed data produces credible patient stories
- [ ] No console errors or warnings in happy-path flow
- [ ] Backlog updated with follow-up items if any
