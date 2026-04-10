# Architecture Overview

## System summary

T1D Command Center is a clinician-first healthcare platform built as a pnpm monorepo with a modular-monolith architecture. It supports synthetic healthcare-like data ingestion, clinician workflows, explainable risk scoring, auditability, bilingual UI, and theme-aware UI. It is designed for hosted deployment as a production-shaped MVP with synthetic data.

## High-level architecture

- apps/web-clinician: clinician-facing Next.js app (SSR + API routes)
- apps/web-patient: patient-facing shell (future)
- apps/api: API and domain orchestration layer (future — currently API routes in web-clinician)
- apps/worker: background processing (future — currently inline in API routes)
- shared packages: UI, config, types, i18n, database, auth, observability, synthetic-data, risk-engine, summary-engine, fhir-model

## Deployment model

For MVP, the system deploys as a single Next.js app connected to a managed PostgreSQL database. No separate API server or worker process. This is the simplest correct deployment for a monolith.

## Core architectural principles

- Document-driven implementation
- Modular boundaries inside a monolith first
- Clear traceability from raw input to normalized event to derived metric
- Explainable logic before advanced ML
- Accessibility, i18n, and theming as first-class requirements
- Testing and operability built in from the start
- Deployed-environment readiness from day one

## Primary technical capabilities

- population dashboard
- patient detail views
- seeded synthetic data
- derived metrics and risk scoring
- summary generation
- tasking and alerts
- audit trail
- structured logging and health checks
- hosted deployment with managed database

## Constraints

- TypeScript strict mode
- pnpm workspace
- Next.js-based frontend
- Production-minded implementation
- No real vendor integrations in MVP
- All data is synthetic — no real patient data
