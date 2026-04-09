import type { PrismaClient, Prisma, ObservationType } from '@prisma/client';
import type { IngestPayload } from './schema';

export interface IngestResult {
  status: 'created' | 'duplicate';
  rawPayloadId: string;
  observationsCreated: number;
}

/**
 * Ingest a validated payload into the database.
 *
 * 1. Check idempotency — if sourceId exists, return duplicate
 * 2. Resolve patient by externalRef
 * 3. Store raw payload
 * 4. Normalize events into Observation records
 * 5. Return result
 */
export async function ingestPayload(
  prisma: PrismaClient,
  data: IngestPayload,
): Promise<IngestResult> {
  // Idempotency check
  const existing = await prisma.rawPayload.findUnique({
    where: { sourceId: data.sourceId },
    select: { id: true },
  });

  if (existing) {
    return { status: 'duplicate', rawPayloadId: existing.id, observationsCreated: 0 };
  }

  // Resolve patient
  const patient = await prisma.patient.findUnique({
    where: { externalRef: data.patientExternalRef },
    select: { id: true },
  });

  if (!patient) {
    throw new Error(`Patient not found: ${data.patientExternalRef}`);
  }

  // Store raw payload
  const rawPayload = await prisma.rawPayload.create({
    data: {
      sourceId: data.sourceId,
      sourceType: data.sourceType,
      patientId: patient.id,
      payload: JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue,
      eventCount: data.events.length,
    },
  });

  // Normalize events → Observations
  const observations: Prisma.ObservationCreateManyInput[] = data.events.map((event) => {
    const obs: Prisma.ObservationCreateManyInput = {
      patientId: patient.id,
      type: event.type as ObservationType,
      value: event.value,
      unit: event.unit,
      observedAt: new Date(event.observedAt),
      sourceType: data.sourceType,
      sourcePayloadId: rawPayload.id,
    };
    if (event.subType) obs.subType = event.subType;
    if (event.metadata) {
      obs.metadata = JSON.parse(JSON.stringify(event.metadata)) as Prisma.InputJsonValue;
    }
    return obs;
  });

  await prisma.observation.createMany({ data: observations });

  return {
    status: 'created',
    rawPayloadId: rawPayload.id,
    observationsCreated: observations.length,
  };
}
