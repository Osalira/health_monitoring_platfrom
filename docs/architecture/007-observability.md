# Observability

## Goals
- make failures debuggable
- make processing visible
- keep logs structured and useful
- support health checks and operational inspection

## Requirements
- structured logging
- error boundaries where appropriate
- health endpoint(s)
- worker/job visibility where practical
- clear developer notes for debugging

## Signals to surface
- request failures
- validation failures
- ingestion failures
- queue lag/failures
- summary generation failures
- risk scoring failures