# Decision Log

## 2026-04-09 - Initial architecture direction
Status: Accepted

### Decision
Use a pnpm monorepo with a modular-monolith architecture:
- apps/web
- apps/api
- apps/worker
- shared packages for UI, config, i18n, database, observability, and domain-adjacent logic

### Why
This keeps the project maintainable, fast to build, and easy to explain in an interview while still demonstrating strong system design.

### Consequences
- easier local development
- lower coordination overhead
- future extraction remains possible if growth or team topology demands it