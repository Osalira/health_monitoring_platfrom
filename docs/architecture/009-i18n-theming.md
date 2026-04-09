# Internationalization and Theming

## Localization goals
- English and French are required from day one
- no mixed untranslated UI
- localized formatting for dates, numbers, and times where applicable

## Localization strategy
- central dictionaries for EN and FR
- route/provider based locale setup
- shared translation utilities
- strict rule: no literal UI copy in TSX except internal debug text if explicitly allowed

## Message key conventions
Use structured namespaces, for example:
- common.actions.save
- common.actions.cancel
- dashboard.title
- dashboard.filters.searchPlaceholder
- patient.header.lastSync
- summary.actions.generate

## Theming goals
- light and dark mode first-class
- semantic design tokens
- root theme provider
- persistence where appropriate
- charts and data-dense components must remain legible in both themes

## Theming rules
- prefer semantic tokens/classes
- avoid arbitrary one-off styling
- avoid unreadable contrast
- test all major pages in both themes

## Verification expectations
Every major stage must include:
- EN verification
- FR verification
- light mode verification
- dark mode verification