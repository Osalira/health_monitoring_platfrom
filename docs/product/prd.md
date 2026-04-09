
---

## 3. `docs/product/prd.md`

```md
# PRD - T1D Command Center

## Vision
Build a clinician-first digital platform for proactive type 1 diabetes care that unifies heterogeneous patient data, highlights the highest-priority patients, and enables traceable, explainable care workflows.

## Product principles
- Clinician-first, not chatbot-first
- Explainable, not magical
- Bilingual from day one
- Theme-aware from day one
- Accessibility is required
- Production-minded engineering
- Operationally debuggable
- Privacy-aware by design

## Primary users
- Clinician
- Diabetes educator
- Clinic administrator
- Patient
- Caregiver

## MVP goals
- Population dashboard for clinicians
- Patient detail page with trends and context
- Synthetic ingestion and seeded data
- Derived metrics and explainable risk scoring
- Visit prep summary
- Tasks, alerts, and outreach tracking
- Audit trail
- English/French localization
- Light/dark theme support

## Non-goals for MVP
- Native mobile app
- Live chat or real-time messaging
- Real EMR integrations
- Real device vendor integrations
- Automated diagnosis
- Medication recommendation automation

## Core product requirements
- All user-facing UI must work in English and French.
- All major UI surfaces must work in light and dark mode.
- All generated insights must be traceable to underlying data.
- The platform must support seeded synthetic patients and meaningful demo flows.
- The clinician dashboard must prioritize action and visibility into why a patient is flagged.
- The patient chart must show longitudinal trends and relevant context.
- The system must preserve auditability and role-aware protections.

## Core user journeys

### 1. Clinician Monday Morning Review
A clinician signs in and sees:
- summary KPIs
- a prioritized patient roster
- risk tier or score
- trend changes
- sync/adherence issues
- alerts/tasks requiring attention

Outcome:
The clinician can quickly identify who needs review now and why.

### 2. Open Patient Chart
A clinician selects a patient and sees:
- patient summary
- longitudinal glucose and supporting context
- insulin, meals, activity, labs, and tasks
- recent changes and alerts
- risk explanation

Outcome:
The clinician understands the patient’s recent trajectory and can prepare for follow-up.

### 3. Generate Visit Prep Summary
A clinician generates a structured summary based on existing data.

Outcome:
The summary captures key changes, relevant metrics, and discussion points without unsupported claims.

### 4. Review Audit Trail
A clinician or admin reviews important actions and access events.

Outcome:
Sensitive reads/writes are visible and traceable.

## Success criteria
- Demo environment is stable and repeatable
- Synthetic seed data creates meaningful patient stories
- Dashboard and patient chart flows are credible and polished
- EN/FR switching works consistently
- Light/dark switching works consistently
- Main workflow passes automated and manual checks

## Constraints
- Build as a pnpm monorepo
- Use Next.js + TypeScript
- Favor modular-monolith boundaries over premature microservices
- Favor simple, maintainable implementations first