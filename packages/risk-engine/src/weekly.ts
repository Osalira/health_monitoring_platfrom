/**
 * Weekly feature computation for risk scoring input.
 *
 * Aggregates daily metrics into weekly features.
 */

import type { DailyMetricData } from './daily';

export interface WeeklyFeatureData {
  avgGlucose: number | null;
  glucoseCV: number | null;
  avgTimeInRange: number | null;
  avgTimeBelowRange: number | null;
  adherenceScore: number | null;
  hypoglycemiaEpisodes: number;
  hyperglycemiaEpisodes: number;
}

/**
 * Compute weekly features from an array of daily metrics.
 *
 * @param dailyMetrics - 7 days of metrics (may have fewer for partial weeks)
 */
export function computeWeeklyFeatures(dailyMetrics: DailyMetricData[]): WeeklyFeatureData {
  const withGlucose = dailyMetrics.filter((d) => d.glucoseMean != null);

  if (withGlucose.length === 0) {
    return {
      avgGlucose: null,
      glucoseCV: null,
      avgTimeInRange: null,
      avgTimeBelowRange: null,
      adherenceScore: null,
      hypoglycemiaEpisodes: 0,
      hyperglycemiaEpisodes: 0,
    };
  }

  const glucoseMeans = withGlucose.map((d) => d.glucoseMean!);
  const avgGlucose = glucoseMeans.reduce((a, b) => a + b, 0) / glucoseMeans.length;

  // Coefficient of variation = stdDev / mean
  const glucoseStdDevs = withGlucose.map((d) => d.glucoseStdDev!);
  const avgStdDev = glucoseStdDevs.reduce((a, b) => a + b, 0) / glucoseStdDevs.length;
  const glucoseCV = avgGlucose > 0 ? avgStdDev / avgGlucose : null;

  // Time in range averages
  const tirValues = withGlucose.map((d) => d.timeInRange!);
  const avgTimeInRange = tirValues.reduce((a, b) => a + b, 0) / tirValues.length;

  const tbrValues = withGlucose.map((d) => d.timeBelowRange!);
  const avgTimeBelowRange = tbrValues.reduce((a, b) => a + b, 0) / tbrValues.length;

  // Adherence: actual readings / expected readings
  const totalReadings = dailyMetrics.reduce((a, d) => a + d.readingCount, 0);
  const totalExpected = dailyMetrics.reduce((a, d) => a + d.expectedReadingCount, 0);
  const adherenceScore = totalExpected > 0 ? totalReadings / totalExpected : null;

  // Episode counts: days with significant low/high
  const hypoglycemiaEpisodes = withGlucose.filter((d) => (d.timeBelowRange ?? 0) > 0.05).length;
  const hyperglycemiaEpisodes = withGlucose.filter((d) => (d.timeAboveRange ?? 0) > 0.5).length;

  return {
    avgGlucose: round2(avgGlucose),
    glucoseCV: glucoseCV != null ? round4(glucoseCV) : null,
    avgTimeInRange: round4(avgTimeInRange),
    avgTimeBelowRange: round4(avgTimeBelowRange),
    adherenceScore: adherenceScore != null ? round4(adherenceScore) : null,
    hypoglycemiaEpisodes,
    hyperglycemiaEpisodes,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
