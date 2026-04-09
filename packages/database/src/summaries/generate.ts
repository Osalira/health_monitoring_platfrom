/**
 * Visit-prep summary generation.
 *
 * Produces a structured summary from existing patient data.
 * No LLM — uses a deterministic template approach.
 */

import type { PrismaClient, Prisma } from '@prisma/client';

export interface SummaryContent {
  patientName: string;
  generatedAt: string;
  riskSummary: {
    tier: string;
    score: number;
    topFactors: { name: string; value: number }[];
  } | null;
  recentMetrics: {
    avgGlucose: number | null;
    timeInRange: number | null;
    latestHbA1c: number | null;
    readingAdherence: number | null;
  };
  openItems: {
    taskCount: number;
    alertCount: number;
    topTasks: string[];
    topAlerts: string[];
  };
  deviceStatus: {
    devices: { type: string; status: string; lastSync: string | null }[];
  };
}

export interface GenerateSummaryResult {
  id: string;
  kind: string;
  content: SummaryContent;
  generatedAt: Date;
}

export async function generateVisitPrepSummary(
  prisma: PrismaClient,
  patientId: string,
  generatedByUserId?: string,
): Promise<GenerateSummaryResult> {
  // Fetch patient data in parallel
  const [patient, risk, tasks, alerts, devices, recentGlucose, latestHbA1c] = await Promise.all([
    prisma.patient.findUniqueOrThrow({
      where: { id: patientId },
      select: { firstName: true, lastName: true },
    }),
    prisma.riskAssessment.findFirst({
      where: { patientId },
      orderBy: { computedAt: 'desc' },
    }),
    prisma.task.findMany({
      where: { patientId, status: { in: ['OPEN', 'IN_PROGRESS'] } },
      orderBy: { priority: 'desc' },
      take: 5,
      select: { title: true },
    }),
    prisma.alert.findMany({
      where: { patientId, status: { in: ['ACTIVE', 'ACKNOWLEDGED'] } },
      orderBy: { severity: 'desc' },
      take: 5,
      select: { explanation: true, type: true },
    }),
    prisma.device.findMany({
      where: { patientId },
      select: { type: true, status: true, lastSyncedAt: true },
    }),
    prisma.dailyMetric.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      take: 7,
      select: { glucoseMean: true, timeInRange: true, readingCount: true, expectedReadingCount: true },
    }),
    prisma.observation.findFirst({
      where: { patientId, type: 'LAB', subType: 'HbA1c' },
      orderBy: { observedAt: 'desc' },
      select: { value: true },
    }),
  ]);

  // Compute recent averages
  const metricsWithData = recentGlucose.filter((m) => m.glucoseMean != null);
  const avgGlucose = metricsWithData.length > 0
    ? metricsWithData.reduce((a, m) => a + m.glucoseMean!, 0) / metricsWithData.length
    : null;
  const timeInRange = metricsWithData.length > 0
    ? metricsWithData.reduce((a, m) => a + (m.timeInRange ?? 0), 0) / metricsWithData.length
    : null;
  const totalReadings = recentGlucose.reduce((a, m) => a + m.readingCount, 0);
  const totalExpected = recentGlucose.reduce((a, m) => a + m.expectedReadingCount, 0);
  const readingAdherence = totalExpected > 0 ? totalReadings / totalExpected : null;

  const content: SummaryContent = {
    patientName: `${patient.firstName} ${patient.lastName}`,
    generatedAt: new Date().toISOString(),
    riskSummary: risk
      ? {
          tier: risk.tier,
          score: risk.score,
          topFactors: Object.entries(risk.factors as Record<string, number>)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([name, value]) => ({ name, value })),
        }
      : null,
    recentMetrics: {
      avgGlucose: avgGlucose ? Math.round(avgGlucose) : null,
      timeInRange: timeInRange ? Math.round(timeInRange * 100) / 100 : null,
      latestHbA1c: latestHbA1c?.value ?? null,
      readingAdherence: readingAdherence ? Math.round(readingAdherence * 100) / 100 : null,
    },
    openItems: {
      taskCount: tasks.length,
      alertCount: alerts.length,
      topTasks: tasks.map((t) => t.title),
      topAlerts: alerts.map((a) => a.explanation ?? a.type),
    },
    deviceStatus: {
      devices: devices.map((d) => ({
        type: d.type,
        status: d.status,
        lastSync: d.lastSyncedAt?.toISOString() ?? null,
      })),
    },
  };

  // Persist
  const createData: Prisma.GeneratedSummaryUncheckedCreateInput = {
    patientId,
    kind: 'VISIT_PREP',
    content: JSON.parse(JSON.stringify(content)) as Prisma.InputJsonValue,
    generatedAt: new Date(),
  };
  if (generatedByUserId) createData.generatedByUserId = generatedByUserId;

  const summary = await prisma.generatedSummary.create({
    data: createData,
  });

  return {
    id: summary.id,
    kind: summary.kind,
    content,
    generatedAt: summary.generatedAt,
  };
}
