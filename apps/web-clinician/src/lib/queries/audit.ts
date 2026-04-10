import { prisma, getAuditEvents, type AuditEventRow } from '@t1d/database';

export type { AuditEventRow };

export async function getRecentAuditEvents(limit = 50): Promise<AuditEventRow[]> {
  return getAuditEvents(prisma, { limit });
}
