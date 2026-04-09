# Data Ingestion

## Goal
Support believable synthetic and device-like inputs that can be normalized into canonical forms and later used for derived metrics and risk scoring.

## Flow
1. Receive source payload
2. Validate payload shape
3. Store raw payload if appropriate
4. Normalize into canonical event(s)
5. Persist normalized data
6. Trigger derived metric recomputation
7. Trigger risk recomputation where relevant
8. Record audit and operational metadata where relevant

## Requirements
- idempotent behavior where feasible
- traceability from raw input to normalized output
- source-aware processing
- deterministic synthetic pipeline support

## Example source categories
- CGM-like glucose stream
- pump-like insulin events
- activity events
- meals/carb entries
- questionnaires
- labs
- sync heartbeat events