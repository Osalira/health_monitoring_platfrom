# Testing Strategy

## Philosophy
Test behavior and critical workflow outcomes, not implementation trivia.

## Layers

### Unit tests
- formatting utilities
- calculators
- risk heuristics
- generators
- validators
- role/access helpers

### Component tests
- theme toggle
- locale switcher
- dashboard widgets
- patient page panels
- summary cards
- loading/empty/error states

### Integration tests
- dashboard data loading
- patient detail data rendering
- ingestion flow
- derived metric computation
- risk persistence
- summary generation
- audit event creation

### E2E tests
- enter app
- switch locale
- switch theme
- open patient page
- create/view task
- generate summary
- view audit trail

## Required quality gate
All changed work should pass:
- lint
- typecheck
- relevant tests
- build when appropriate