# Domain Model

## Core entities

### User
Represents an authenticated actor in the system.

Key fields:
- id
- email
- displayName
- role
- localePreference
- themePreference
- createdAt
- updatedAt

### Patient
Represents a patient whose data is reviewed in the system.

Key fields:
- id
- externalRef
- firstName
- lastName
- birthDate
- sexAtBirth
- diagnosisDate
- primaryLanguage
- createdAt
- updatedAt

### Device
Represents a device source or wearable.

Key fields:
- id
- patientId
- type
- manufacturer
- model
- sourceKey
- status
- lastSyncedAt

### Observation
Represents canonical observations such as glucose readings, lab results, or other measurable events.

Key fields:
- id
- patientId
- type
- value
- unit
- observedAt
- sourceType
- sourcePayloadId
- normalizedEventId

### Task
Represents clinician or educator actions.

Key fields:
- id
- patientId
- title
- description
- status
- priority
- assignedToUserId
- createdByUserId
- dueAt

### Alert
Represents surfaced issues requiring attention.

Key fields:
- id
- patientId
- type
- severity
- status
- triggeredAt
- explanation

### RiskAssessment
Represents explainable risk outputs.

Key fields:
- id
- patientId
- score
- tier
- factors
- computedAt
- modelVersion
- sourceWindow

### GeneratedSummary
Represents visit prep or other generated structured summary outputs.

Key fields:
- id
- patientId
- kind
- content
- sourceSnapshot
- generatedAt
- generatedByUserId

### AuditEvent
Represents sensitive access or mutation events.

Key fields:
- id
- actorUserId
- patientId
- action
- resourceType
- resourceId
- metadata
- occurredAt

### ConsentRecord
Represents patient privacy or sharing state.

Key fields:
- id
- patientId
- consentType
- status
- grantedAt
- revokedAt

## Supporting concepts
- raw payloads
- normalized events
- daily metrics
- weekly patient features
- device sync events
- outreach log

## Modeling principles
- preserve traceability
- keep canonical structures practical
- separate raw input from normalized/useful domain state
- keep risk and summaries explainable