/**
 * Risk score computation with explainability factors.
 *
 * Produces a 0-100 score and a tier classification.
 * Each factor contributes a weighted portion to the total score.
 *
 * Formula:
 *   score = Σ (factor_weight × normalized_value)
 *   Normalized values are 0-1 where 1 = highest risk.
 *
 * Tier thresholds:
 *   0-30: LOW
 *   31-55: MODERATE
 *   56-80: HIGH
 *   81-100: CRITICAL
 */

import type { WeeklyFeatureData } from './weekly';

export type RiskTier = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskFactors {
  timeInRange: number;
  glucoseVariability: number;
  hba1c: number;
  adherence: number;
  hypoglycemiaFrequency: number;
  dataRecency: number;
}

export interface RiskResult {
  score: number;
  tier: RiskTier;
  factors: RiskFactors;
}

interface RiskInput {
  weeklyFeatures: WeeklyFeatureData;
  latestHbA1c?: number | null | undefined;
  deviceAdherence?: number | null | undefined;
}

const WEIGHTS = {
  timeInRange: 25,
  glucoseVariability: 20,
  hba1c: 20,
  adherence: 15,
  hypoglycemiaFrequency: 10,
  dataRecency: 10,
};

export function computeRiskScore(input: RiskInput): RiskResult {
  const { weeklyFeatures, latestHbA1c, deviceAdherence } = input;

  // Normalize factors to 0-1 (higher = more risk)
  const timeInRange = weeklyFeatures.avgTimeInRange != null
    ? clamp(1 - weeklyFeatures.avgTimeInRange) // Low TIR = high risk
    : 0.5;

  const glucoseVariability = weeklyFeatures.glucoseCV != null
    ? clamp(weeklyFeatures.glucoseCV / 0.5) // CV > 50% = max risk
    : 0.5;

  const hba1c = latestHbA1c != null
    ? clamp((latestHbA1c - 5.5) / 5) // 5.5% = no risk, 10.5% = max risk
    : 0.5;

  const adherence = deviceAdherence != null
    ? clamp(1 - deviceAdherence) // Low adherence = high risk
    : weeklyFeatures.adherenceScore != null
      ? clamp(1 - weeklyFeatures.adherenceScore)
      : 0.5;

  const hypoglycemiaFrequency = clamp(weeklyFeatures.hypoglycemiaEpisodes / 7);

  const dataRecency = weeklyFeatures.adherenceScore != null
    ? clamp(1 - weeklyFeatures.adherenceScore) // Same as adherence for now
    : 0.5;

  const factors: RiskFactors = {
    timeInRange: round4(timeInRange),
    glucoseVariability: round4(glucoseVariability),
    hba1c: round4(hba1c),
    adherence: round4(adherence),
    hypoglycemiaFrequency: round4(hypoglycemiaFrequency),
    dataRecency: round4(dataRecency),
  };

  // Weighted sum
  const score = Math.round(
    factors.timeInRange * WEIGHTS.timeInRange +
    factors.glucoseVariability * WEIGHTS.glucoseVariability +
    factors.hba1c * WEIGHTS.hba1c +
    factors.adherence * WEIGHTS.adherence +
    factors.hypoglycemiaFrequency * WEIGHTS.hypoglycemiaFrequency +
    factors.dataRecency * WEIGHTS.dataRecency,
  );

  const tier = scoreToTier(score);

  return { score: clampScore(score), tier, factors };
}

function scoreToTier(score: number): RiskTier {
  if (score >= 81) return 'CRITICAL';
  if (score >= 56) return 'HIGH';
  if (score >= 31) return 'MODERATE';
  return 'LOW';
}

function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function clampScore(v: number): number {
  return Math.max(0, Math.min(100, v));
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
