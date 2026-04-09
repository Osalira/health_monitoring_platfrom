/** Database client and schema exports for T1D Command Center. */

export { PrismaClient } from '@prisma/client';
export type * from '@prisma/client';

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Singleton PrismaClient instance.
 *
 * In development, this is cached on globalThis to survive HMR reloads.
 * In production, a fresh instance is created per process.
 */
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env['NODE_ENV'] === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Ingestion
export {
  ingestPayloadSchema,
  observationEventSchema,
  ingestPayload,
  type IngestPayload,
  type ObservationEvent,
  type IngestResult,
} from './ingestion/index';

// Metrics
export { computePatientMetrics, type ComputeMetricsResult } from './metrics/index';

// Summaries
export { generateVisitPrepSummary, type SummaryContent, type GenerateSummaryResult } from './summaries/index';
