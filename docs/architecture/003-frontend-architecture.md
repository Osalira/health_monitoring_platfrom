# Frontend Architecture

## Objectives
- Clinician-first experience
- Shared layout and reusable UI
- Full bilingual coverage
- Full light/dark support
- Accessible interactions

## App structure
The main UI lives in apps/web and should use:
- App Router
- route groups where useful
- server-first patterns when appropriate
- client components only when needed

## UI layers
- app shell
- feature modules
- shared UI primitives
- feature-specific containers
- formatting helpers
- localization hooks/utilities

## UX rules
- loading states must be intentional
- empty states must be informative
- errors must be understandable
- tables/charts/forms must be readable in both themes
- navigation and focus states must remain accessible

## Shared UI
Shared primitives should live in packages/ui.

Expected categories:
- buttons
- inputs
- select/switch controls
- cards
- layout primitives
- tables
- badges
- dialogs
- skeleton/loading components

## Localization rules
- no literal display strings in page/component code
- messages stored centrally
- shared key naming conventions
- localized date/number formatting