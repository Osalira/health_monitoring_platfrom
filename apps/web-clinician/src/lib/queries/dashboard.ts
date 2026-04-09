import { prisma } from '@t1d/database';

export interface DashboardKpis {
  totalPatients: number;
  highRiskPatients: number;
  openTasks: number;
  activeAlerts: number;
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const [totalPatients, highRiskPatients, openTasks, activeAlerts] = await Promise.all([
    prisma.patient.count(),
    prisma.riskAssessment.count({
      where: { tier: { in: ['HIGH', 'CRITICAL'] } },
    }),
    prisma.task.count({
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
    }),
    prisma.alert.count({
      where: { status: 'ACTIVE' },
    }),
  ]);

  return { totalPatients, highRiskPatients, openTasks, activeAlerts };
}
