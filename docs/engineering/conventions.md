# Engineering Conventions

## General
- TypeScript strict mode must stay enabled.
- Avoid `any`. If used, document why.
- Prefer small cohesive modules.
- Do not leave dead code or commented-out code.
- Keep code aligned with documented architecture.

## Repository hygiene
- update docs when behavior or architecture changes
- keep diffs focused
- do not mix unrelated refactors with scoped feature work

## UI conventions
- all user-facing strings must be localized
- all UI must support light and dark mode
- accessibility is required
- shared components belong in packages/ui when reusable
- loading, empty, and error states are part of the feature

## Accessibility
- keyboard navigable
- semantic labels
- visible focus states
- sufficient contrast
- meaningful button/link text

## i18n
- English default
- French required
- no inline untranslated strings in app code
- validation and empty-state copy must also be localized

## Styling
- prefer semantic tokens and shared variants
- avoid hardcoded color values in feature components unless justified
- charts and tables must remain legible in both themes

## API conventions
- validate input with Zod or equivalent
- return typed outputs
- centralized error handling
- structured logging
- no silent failures

## Data conventions
- preserve traceability between source payloads and normalized records
- use clear naming
- avoid premature complexity
- document tradeoffs in decision log when needed

## Testing conventions
- new logic requires tests
- new UI behavior should get component/integration tests when appropriate
- critical workflows require e2e coverage
- do not mark work done unless verification was run