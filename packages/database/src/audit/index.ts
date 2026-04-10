/**
 * Audit event creation and querying.
 */

import type { PrismaClient, Prisma } from '../../generated/prisma';

export interface CreateAuditInput {
  actorUserId?: string | undefined;
  patientId?: string | undefined;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'ACCESS' | 'GENERATE';
  resourceType: string;
  resourceId?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export async function createAuditEvent(
  prisma: PrismaClient,
  input: CreateAuditInput,
): Promise<void> {
  const data: Prisma.AuditEventUncheckedCreateInput = {
    action: input.action,
    resourceType: input.resourceType,
  };
  if (input.actorUserId) data.actorUserId = input.actorUserId;
  if (input.patientId) data.patientId = input.patientId;
  if (input.resourceId) data.resourceId = input.resourceId;
  if (input.metadata) {
    data.metadata = JSON.parse(JSON.stringify(input.metadata)) as Prisma.InputJsonValue;
  }

  await prisma.auditEvent.create({ data });
}

export interface AuditEventRow {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  occurredAt: Date;
  actor: { displayName: string } | null;
  patient: { firstName: string; lastName: string } | null;
}

export interface GetAuditFilters {
  patientId?: string | undefined;
  actorUserId?: string | undefined;
  limit?: number | undefined;
}

export async function getAuditEvents(
  prisma: PrismaClient,
  filters: GetAuditFilters = {},
): Promise<AuditEventRow[]> {
  const where: Prisma.AuditEventWhereInput = {};
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.actorUserId) where.actorUserId = filters.actorUserId;

  return prisma.auditEvent.findMany({
    where,
    orderBy: { occurredAt: 'desc' },
    take: filters.limit ?? 100,
    select: {
      id: true,
      action: true,
      resourceType: true,
      resourceId: true,
      occurredAt: true,
      actor: { select: { displayName: true } },
      patient: { select: { firstName: true, lastName: true } },
    },
  });
}
