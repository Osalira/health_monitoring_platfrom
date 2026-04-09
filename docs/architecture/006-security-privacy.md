# Security and Privacy

## Security posture for MVP
This project is demo-oriented but must show production-minded thinking.

## Required foundations
- role-aware access checks
- auditability for important reads/writes
- minimal privilege assumptions
- structured error handling
- environment-safe configuration handling
- no secrets committed in code

## Privacy posture
- support consent/privacy markers
- keep traceability for sensitive actions
- avoid unsupported clinical output
- preserve data provenance for generated content

## Design expectations
- mock/demo auth is acceptable initially
- architecture should allow real auth replacement later
- privacy-aware decisions should be documented in decision log when relevant