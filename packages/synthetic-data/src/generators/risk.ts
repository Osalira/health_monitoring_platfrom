import type { ArchetypeConfig } from '../archetypes';
import { type Rng, randGaussian } from '../rng';

export interface GeneratedRisk {
  score: number;
  tier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  factors: Record<string, number>;
  modelVersion: string;
  sourceWindowStart: Date;
  sourceWindowEnd: Date;
  computedAt: Date;
}

const TIER_SCORE_RANGES: Record<string, [number, number]> = {
  LOW: [10, 30],
  MODERATE: [35, 55],
  HIGH: [60, 80],
  CRITICAL: [85, 98],
};

export function generateRiskAssessment(
  rng: Rng,
  archetype: ArchetypeConfig,
  startDate: Date,
): GeneratedRisk {
  const range = TIER_SCORE_RANGES[archetype.riskTier] ?? [50, 50];
  const mean = (range[0] + range[1]) / 2;
  const score = Math.max(range[0], Math.min(range[1], Math.round(randGaussian(rng, mean, 5))));

  const endDate = new Date(startDate.getTime() + archetype.historyDays * 24 * 60 * 60 * 1000);
  const windowStart = new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Explainability factors — normalized 0-1 contributions
  const factors: Record<string, number> = {
    timeInRange: archetype.tirTarget,
    glucoseVariability: 1 - archetype.tirTarget,
    hba1c: Math.min(1, (archetype.hba1c - 5.5) / 5),
    adherence: archetype.cgmCoverage,
    hypoglycemiaFrequency: archetype.riskTier === 'CRITICAL' ? 0.8 : archetype.riskTier === 'HIGH' ? 0.5 : 0.1,
    dataRecency: archetype.cgmCoverage > 0.8 ? 0.9 : 0.4,
  };

  return {
    score,
    tier: archetype.riskTier,
    factors,
    modelVersion: 'synthetic-v1',
    sourceWindowStart: windowStart,
    sourceWindowEnd: endDate,
    computedAt: endDate,
  };
}
