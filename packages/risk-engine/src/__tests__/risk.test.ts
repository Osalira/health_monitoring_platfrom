import { describe, it, expect } from 'vitest';
import { computeRiskScore } from '../risk';
import type { WeeklyFeatureData } from '../weekly';

function makeWeekly(overrides: Partial<WeeklyFeatureData> = {}): WeeklyFeatureData {
  return {
    avgGlucose: 130,
    glucoseCV: 0.18,
    avgTimeInRange: 0.75,
    avgTimeBelowRange: 0.02,
    adherenceScore: 0.95,
    hypoglycemiaEpisodes: 0,
    hyperglycemiaEpisodes: 0,
    ...overrides,
  };
}

describe('computeRiskScore', () => {
  it('returns LOW tier for well-controlled patient', () => {
    const result = computeRiskScore({
      weeklyFeatures: makeWeekly(),
      latestHbA1c: 6.8,
      deviceAdherence: 0.95,
    });
    expect(result.tier).toBe('LOW');
    expect(result.score).toBeLessThanOrEqual(30);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('returns CRITICAL tier for poorly controlled patient', () => {
    const result = computeRiskScore({
      weeklyFeatures: makeWeekly({
        avgTimeInRange: 0.3,
        glucoseCV: 0.45,
        adherenceScore: 0.4,
        hypoglycemiaEpisodes: 5,
        hyperglycemiaEpisodes: 6,
      }),
      latestHbA1c: 10.0,
      deviceAdherence: 0.3,
    });
    expect(['HIGH', 'CRITICAL']).toContain(result.tier);
    expect(result.score).toBeGreaterThanOrEqual(56);
  });

  it('returns MODERATE tier for declining patient', () => {
    const result = computeRiskScore({
      weeklyFeatures: makeWeekly({
        avgTimeInRange: 0.55,
        glucoseCV: 0.3,
        adherenceScore: 0.8,
        hypoglycemiaEpisodes: 1,
      }),
      latestHbA1c: 7.8,
    });
    expect(result.tier).toBe('MODERATE');
  });

  it('factors are between 0 and 1', () => {
    const result = computeRiskScore({ weeklyFeatures: makeWeekly() });
    for (const [_key, value] of Object.entries(result.factors)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it('score is clamped between 0 and 100', () => {
    const result = computeRiskScore({ weeklyFeatures: makeWeekly() });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('handles null weekly features gracefully', () => {
    const result = computeRiskScore({
      weeklyFeatures: {
        avgGlucose: null,
        glucoseCV: null,
        avgTimeInRange: null,
        avgTimeBelowRange: null,
        adherenceScore: null,
        hypoglycemiaEpisodes: 0,
        hyperglycemiaEpisodes: 0,
      },
    });
    expect(result.tier).toBeDefined();
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('handles extreme CV (> 0.5) — clamps to max', () => {
    const result = computeRiskScore({
      weeklyFeatures: makeWeekly({ glucoseCV: 0.8 }),
    });
    expect(result.factors.glucoseVariability).toBe(1);
  });

  it('handles very low HbA1c (below 5.5) — clamps to 0', () => {
    const result = computeRiskScore({
      weeklyFeatures: makeWeekly(),
      latestHbA1c: 4.5,
    });
    expect(result.factors.hba1c).toBe(0);
  });

  it('handles very high HbA1c (above 10.5) — clamps to 1', () => {
    const result = computeRiskScore({
      weeklyFeatures: makeWeekly(),
      latestHbA1c: 12.0,
    });
    expect(result.factors.hba1c).toBe(1);
  });

  it('perfect adherence yields 0 adherence risk', () => {
    const result = computeRiskScore({
      weeklyFeatures: makeWeekly({ adherenceScore: 1.0 }),
      deviceAdherence: 1.0,
    });
    expect(result.factors.adherence).toBe(0);
  });

  it('all 6 factors are present in result', () => {
    const result = computeRiskScore({ weeklyFeatures: makeWeekly() });
    const expectedKeys = [
      'timeInRange', 'glucoseVariability', 'hba1c',
      'adherence', 'hypoglycemiaFrequency', 'dataRecency',
    ];
    for (const key of expectedKeys) {
      expect(result.factors).toHaveProperty(key);
    }
  });
});
