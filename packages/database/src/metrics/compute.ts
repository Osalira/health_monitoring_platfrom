/**
 * Metrics computation orchestrator.
 *
 * Queries observations from the database, runs risk-engine computations,
 * and upserts DailyMetric / WeeklyFeature / RiskAssessment records.
 */

import type { PrismaClient, Prisma } from '@prisma/client';
import {
  computeDailyMetrics,
  computeWeeklyFeatures,
  computeRiskScore,
  type DailyMetricData,
} from '@t1d/risk-engine';

export interface ComputeMetricsResult {
  patientId: string;
  dailyMetricsUpserted: number;
  weeklyFeaturesUpserted: number;
  riskAssessmentCreated: boolean;
}

/**
 * Recompute all metrics for a patient over a given window.
 *
 * @param prisma - PrismaClient instance
 * @param patientId - Patient UUID
 * @param days - Number of days to compute (default 30)
 */
export async function computePatientMetrics(
  prisma: PrismaClient,
  patientId: string,
  days = 30,
): Promise<ComputeMetricsResult> {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  // Fetch all observations in the window
  const observations = await prisma.observation.findMany({
    where: {
      patientId,
      observedAt: { gte: startDate, lte: endDate },
    },
    orderBy: { observedAt: 'asc' },
    select: { type: true, subType: true, value: true, unit: true, observedAt: true },
  });

  // Group by day
  const byDay = new Map<string, typeof observations>();
  for (const obs of observations) {
    const dayKey = obs.observedAt.toISOString().slice(0, 10);
    const existing = byDay.get(dayKey);
    if (existing) {
      existing.push(obs);
    } else {
      byDay.set(dayKey, [obs]);
    }
  }

  // Compute daily metrics
  const dailyResults: { date: string; metrics: DailyMetricData }[] = [];

  for (const [dayKey, dayObs] of byDay) {
    const glucose = dayObs
      .filter((o) => o.type === 'GLUCOSE')
      .map((o) => ({ value: o.value, observedAt: o.observedAt }));
    const insulin = dayObs
      .filter((o) => o.type === 'INSULIN')
      .map((o) => ({ value: o.value }));
    const meals = dayObs
      .filter((o) => o.type === 'CARBS')
      .map((o) => ({ value: o.value }));
    const activity = dayObs
      .filter((o) => o.type === 'ACTIVITY')
      .map((o) => ({ value: o.value }));

    const metrics = computeDailyMetrics(glucose, insulin, meals, activity);
    dailyResults.push({ date: dayKey, metrics });
  }

  // Upsert daily metrics
  let dailyMetricsUpserted = 0;
  for (const { date, metrics } of dailyResults) {
    await prisma.dailyMetric.upsert({
      where: { patientId_date: { patientId, date: new Date(date) } },
      update: { ...metrics },
      create: { patientId, date: new Date(date), ...metrics },
    });
    dailyMetricsUpserted++;
  }

  // Compute weekly features (last 2 weeks)
  const sortedDaily = dailyResults
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => d.metrics);

  let weeklyFeaturesUpserted = 0;

  // Week 1: last 7 days, Week 2: days 8-14
  const recentWeek = sortedDaily.slice(-7);
  if (recentWeek.length > 0) {
    const weeklyData = computeWeeklyFeatures(recentWeek);
    const weekStart = new Date(dailyResults[dailyResults.length - 1]!.date);
    weekStart.setDate(weekStart.getDate() - 6);

    await prisma.weeklyFeature.upsert({
      where: { patientId_weekStart: { patientId, weekStart } },
      update: {
        avgGlucose: weeklyData.avgGlucose,
        glucoseCV: weeklyData.glucoseCV,
        avgTimeInRange: weeklyData.avgTimeInRange,
        avgTimeBelowRange: weeklyData.avgTimeBelowRange,
        adherenceScore: weeklyData.adherenceScore,
        hypoglycemiaEpisodes: weeklyData.hypoglycemiaEpisodes,
        hyperglycemiaEpisodes: weeklyData.hyperglycemiaEpisodes,
      },
      create: {
        patientId,
        weekStart,
        ...weeklyData,
      },
    });
    weeklyFeaturesUpserted++;

    // Compute risk score
    const latestHbA1c = await prisma.observation.findFirst({
      where: { patientId, type: 'LAB', subType: 'HbA1c' },
      orderBy: { observedAt: 'desc' },
      select: { value: true },
    });

    const latestDevice = await prisma.device.findFirst({
      where: { patientId, type: 'CGM' },
      select: { lastSyncedAt: true },
    });

    const hoursAgo = latestDevice?.lastSyncedAt
      ? (Date.now() - latestDevice.lastSyncedAt.getTime()) / (1000 * 60 * 60)
      : null;
    const deviceAdherence = hoursAgo != null ? Math.max(0, 1 - hoursAgo / 72) : null;

    const riskResult = computeRiskScore({
      weeklyFeatures: weeklyData,
      latestHbA1c: latestHbA1c?.value,
      deviceAdherence,
    });

    await prisma.riskAssessment.create({
      data: {
        patientId,
        score: riskResult.score,
        tier: riskResult.tier,
        factors: JSON.parse(JSON.stringify(riskResult.factors)) as Prisma.InputJsonValue,
        modelVersion: 'risk-engine-v1',
        sourceWindowStart: startDate,
        sourceWindowEnd: endDate,
      },
    });
  }

  return {
    patientId,
    dailyMetricsUpserted,
    weeklyFeaturesUpserted,
    riskAssessmentCreated: weeklyFeaturesUpserted > 0,
  };
}
