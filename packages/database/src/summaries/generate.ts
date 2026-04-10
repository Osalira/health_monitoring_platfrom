/**
 * Visit-prep summary generation with provenance and i18n.
 *
 * Fetches patient data from DB, delegates composition to @t1d/summary-engine,
 * and persists the structured result.
 */

import type { PrismaClient, Prisma } from '../../generated/prisma';
import { composeVisitPrep, type SummaryLocale, type VisitPrepSummary, type SummaryInput } from '@t1d/summary-engine';

// Re-export for backward compat
export type { VisitPrepSummary as SummaryContent } from '@t1d/summary-engine';

export interface GenerateSummaryResult {
  id: string;
  kind: string;
  content: VisitPrepSummary;
  generatedAt: Date;
}

export async function generateVisitPrepSummary(
  prisma: PrismaClient,
  patientId: string,
  generatedByUserId?: string,
  locale: SummaryLocale = 'en',
): Promise<GenerateSummaryResult> {
  // Fetch patient data in parallel
  const [patientRecord, risk, tasks, alerts, devices, recentMetrics, prevMetrics, latestHbA1c] = await Promise.all([
    prisma.patient.findUniqueOrThrow({
      where: { id: patientId },
      select: { firstName: true, lastName: true, birthDate: true, diagnosisDate: true },
    }),
    prisma.riskAssessment.findFirst({
      where: { patientId },
      orderBy: { computedAt: 'desc' },
    }),
    prisma.task.findMany({
      where: { patientId, status: { in: ['OPEN', 'IN_PROGRESS'] } },
      orderBy: { priority: 'desc' },
      take: 5,
      select: { id: true, title: true },
    }),
    prisma.alert.findMany({
      where: { patientId, status: { in: ['ACTIVE', 'ACKNOWLEDGED'] } },
      orderBy: { severity: 'desc' },
      take: 5,
      select: { id: true, explanation: true, type: true },
    }),
    prisma.device.findMany({
      where: { patientId },
      select: { id: true, type: true, status: true, lastSyncedAt: true },
    }),
    // Last 7 days
    prisma.dailyMetric.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      take: 7,
      select: { glucoseMean: true, timeInRange: true, readingCount: true, expectedReadingCount: true },
    }),
    // Prior 7 days (days 8-14)
    prisma.dailyMetric.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
      skip: 7,
      take: 7,
      select: { glucoseMean: true, timeInRange: true },
    }),
    prisma.observation.findFirst({
      where: { patientId, type: 'LAB', subType: 'HbA1c' },
      orderBy: { observedAt: 'desc' },
      select: { id: true, value: true },
    }),
  ]);

  // Compute averages for current and previous weeks
  const withData = recentMetrics.filter((m) => m.glucoseMean != null);
  const avgGlucose = withData.length > 0
    ? withData.reduce((a, m) => a + m.glucoseMean!, 0) / withData.length
    : null;
  const timeInRange = withData.length > 0
    ? withData.reduce((a, m) => a + (m.timeInRange ?? 0), 0) / withData.length
    : null;
  const totalReadings = recentMetrics.reduce((a, m) => a + m.readingCount, 0);
  const totalExpected = recentMetrics.reduce((a, m) => a + m.expectedReadingCount, 0);
  const adherence = totalExpected > 0 ? totalReadings / totalExpected : null;

  const prevWithData = prevMetrics.filter((m) => m.glucoseMean != null);
  const prevAvgGlucose = prevWithData.length > 0
    ? prevWithData.reduce((a, m) => a + m.glucoseMean!, 0) / prevWithData.length
    : null;
  const prevTimeInRange = prevWithData.length > 0
    ? prevWithData.reduce((a, m) => a + (m.timeInRange ?? 0), 0) / prevWithData.length
    : null;

  // Compute age
  const now = new Date();
  const age = now.getFullYear() - patientRecord.birthDate.getFullYear();

  // Build input for summary engine
  const input: SummaryInput = {
    patient: {
      name: `${patientRecord.firstName} ${patientRecord.lastName}`,
      age,
      diagnosisDate: patientRecord.diagnosisDate?.toISOString().slice(0, 10) ?? null,
    },
    risk: risk
      ? {
          id: risk.id,
          tier: risk.tier,
          score: risk.score,
          topFactors: Object.entries(risk.factors as Record<string, number>)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([name, value]) => ({ name, value })),
        }
      : null,
    metrics: {
      avgGlucose: avgGlucose ? Math.round(avgGlucose) : null,
      prevAvgGlucose: prevAvgGlucose ? Math.round(prevAvgGlucose) : null,
      timeInRange: timeInRange ? Math.round(timeInRange * 100) / 100 : null,
      prevTimeInRange: prevTimeInRange ? Math.round(prevTimeInRange * 100) / 100 : null,
      latestHbA1c: latestHbA1c?.value ?? null,
      latestHbA1cId: latestHbA1c?.id ?? null,
      adherence: adherence ? Math.round(adherence * 100) / 100 : null,
    },
    openTasks: tasks.map((t) => ({ id: t.id, title: t.title })),
    activeAlerts: alerts.map((a) => ({ id: a.id, explanation: a.explanation ?? a.type })),
    devices: devices.map((d) => ({
      id: d.id,
      type: d.type,
      status: d.status,
      lastSyncHoursAgo: d.lastSyncedAt
        ? (now.getTime() - d.lastSyncedAt.getTime()) / (1000 * 60 * 60)
        : null,
    })),
  };

  // Compose summary
  const content = composeVisitPrep(input, locale);

  // Persist
  const createData: Prisma.GeneratedSummaryUncheckedCreateInput = {
    patientId,
    kind: 'VISIT_PREP',
    content: JSON.parse(JSON.stringify(content)) as Prisma.InputJsonValue,
    generatedAt: new Date(),
  };
  if (generatedByUserId) createData.generatedByUserId = generatedByUserId;

  const summary = await prisma.generatedSummary.create({ data: createData });

  return {
    id: summary.id,
    kind: summary.kind,
    content,
    generatedAt: summary.generatedAt,
  };
}
