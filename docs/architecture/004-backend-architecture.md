# Backend Architecture

## Goals
- clear domain boundaries
- simple, maintainable implementation
- strong validation
- good traceability
- easy evolution from demo to production-minded system

## Suggested domains
- auth
- patients
- devices
- observations
- ingestion
- metrics
- risk
- tasks
- alerts
- summaries
- audit
- admin

## API design principles
- validate all inputs
- typed responses
- centralized error handling
- structured logging
- role-aware authorization
- do not expose implementation details in UI-facing contracts

## Persistence principles
- use PostgreSQL as system of record
- keep schema understandable
- preserve links between raw payloads and normalized outputs
- support seeded demo scenarios cleanly