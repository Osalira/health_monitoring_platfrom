/** Database client and schema exports for T1D Command Center. */

export { PrismaClient } from '../generated/prisma';
export type * from '../generated/prisma';

import { PrismaClient } from '../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Singleton PrismaClient instance.
 *
 * Cached on globalThis in ALL environments to prevent connection pool
 * exhaustion in serverless (Vercel) where each invocation would otherwise
 * create a new pool.
 */
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

if (!globalForPrisma.prisma) {
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

// Audit
export { createAuditEvent, getAuditEvents, type CreateAuditInput, type AuditEventRow, type GetAuditFilters } from './audit/index';
