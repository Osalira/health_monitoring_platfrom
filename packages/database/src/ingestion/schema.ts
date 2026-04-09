import { z } from 'zod';

/**
 * Zod schemas for ingestion payload validation.
 */

export const observationEventSchema = z.object({
  type: z.enum([
    'GLUCOSE',
    'INSULIN',
    'CARBS',
    'ACTIVITY',
    'LAB',
    'QUESTIONNAIRE',
    'HEART_RATE',
    'OTHER',
  ]),
  subType: z.string().optional(),
  value: z.number(),
  unit: z.string(),
  observedAt: z.string().datetime(),
  metadata: z.record(z.unknown()).optional(),
});

export const ingestPayloadSchema = z.object({
  sourceId: z.string().min(1, 'sourceId is required'),
  sourceType: z.string().min(1, 'sourceType is required'),
  patientExternalRef: z.string().min(1, 'patientExternalRef is required'),
  events: z.array(observationEventSchema).min(1, 'At least one event is required'),
});

export type IngestPayload = z.infer<typeof ingestPayloadSchema>;
export type ObservationEvent = z.infer<typeof observationEventSchema>;
