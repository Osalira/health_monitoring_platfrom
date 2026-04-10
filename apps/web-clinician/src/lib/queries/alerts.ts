import { prisma } from '@t1d/database';

export interface AlertListRow {
  id: string;
  type: string;
  severity: string;
  status: string;
  explanation: string | null;
  triggeredAt: Date;
  patient: { id: string; firstName: string; lastName: string };
}

export async function getAllActiveAlerts(): Promise<AlertListRow[]> {
  return prisma.alert.findMany({
    where: { status: { in: ['ACTIVE', 'ACKNOWLEDGED'] } },
    orderBy: [{ severity: 'desc' }, { triggeredAt: 'desc' }],
    select: {
      id: true,
      type: true,
      severity: true,
      status: true,
      explanation: true,
      triggeredAt: true,
      patient: { select: { id: true, firstName: true, lastName: true } },
    },
  });
}
