# Architecture Overview

## System summary

T1D Command Center is a clinician-first healthcare platform built as a pnpm monorepo with a modular-monolith architecture. It supports synthetic healthcare-like data ingestion, clinician workflows, explainable risk scoring, auditability, bilingual UI, and theme-aware UI.

## High-level architecture

- apps/web-clinician: clinician-facing Next.js app
- apps/web-patient: patient-facing shell (future)
- apps/api: API and domain orchestration layer
- apps/worker: background processing for derived metrics, risk scoring, and summaries
- shared packages: UI, config, types, i18n, database, auth, observability, synthetic-data, risk-engine, summary-engine, fhir-model

## Core architectural principles

- Document-driven implementation
- Modular boundaries inside a monolith first
- Clear traceability from raw input to normalized event to derived metric
- Explainable logic before advanced ML
- Accessibility, i18n, and theming as first-class requirements
- Testing and operability built in from the start

## Primary technical capabilities

- population dashboard
- patient detail views
- seeded synthetic data
- derived metrics and risk scoring
- summary generation
- tasking and alerts
- audit trail
- structured logging and health checks

## Constraints

- TypeScript strict mode
- pnpm workspace
- Next.js-based frontend
- Production-minded but demo-practical implementation
- No real vendor integrations in MVP
