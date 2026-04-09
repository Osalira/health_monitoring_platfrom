import { describe, it, expect } from 'vitest';
import { ingestPayloadSchema, observationEventSchema } from '../schema';

describe('observationEventSchema', () => {
  it('accepts a valid glucose event', () => {
    const result = observationEventSchema.safeParse({
      type: 'GLUCOSE',
      value: 145,
      unit: 'mg/dL',
      observedAt: '2026-04-09T10:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('accepts an event with subType and metadata', () => {
    const result = observationEventSchema.safeParse({
      type: 'LAB',
      subType: 'HbA1c',
      value: 7.2,
      unit: '%',
      observedAt: '2026-04-09T10:00:00.000Z',
      metadata: { labType: 'HbA1c' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid type', () => {
    const result = observationEventSchema.safeParse({
      type: 'INVALID',
      value: 100,
      unit: 'mg/dL',
      observedAt: '2026-04-09T10:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing value', () => {
    const result = observationEventSchema.safeParse({
      type: 'GLUCOSE',
      unit: 'mg/dL',
      observedAt: '2026-04-09T10:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid datetime', () => {
    const result = observationEventSchema.safeParse({
      type: 'GLUCOSE',
      value: 100,
      unit: 'mg/dL',
      observedAt: 'not-a-date',
    });
    expect(result.success).toBe(false);
  });
});

describe('ingestPayloadSchema', () => {
  const validPayload = {
    sourceId: 'upload-001',
    sourceType: 'cgm',
    patientExternalRef: 'synth-patient-000',
    events: [
      { type: 'GLUCOSE', value: 145, unit: 'mg/dL', observedAt: '2026-04-09T10:00:00.000Z' },
    ],
  };

  it('accepts a valid payload', () => {
    const result = ingestPayloadSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('rejects empty sourceId', () => {
    const result = ingestPayloadSchema.safeParse({ ...validPayload, sourceId: '' });
    expect(result.success).toBe(false);
  });

  it('rejects empty events array', () => {
    const result = ingestPayloadSchema.safeParse({ ...validPayload, events: [] });
    expect(result.success).toBe(false);
  });

  it('rejects missing patientExternalRef', () => {
    const { patientExternalRef: _, ...rest } = validPayload;
    const result = ingestPayloadSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});
