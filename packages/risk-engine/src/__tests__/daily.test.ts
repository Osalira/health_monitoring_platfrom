import { describe, it, expect } from 'vitest';
import { computeDailyMetrics, EXPECTED_READINGS_PER_DAY } from '../daily';

describe('computeDailyMetrics', () => {
  const now = new Date();

  it('returns nulls for empty glucose', () => {
    const result = computeDailyMetrics([], [], [], []);
    expect(result.glucoseMean).toBeNull();
    expect(result.timeInRange).toBeNull();
    expect(result.readingCount).toBe(0);
    expect(result.expectedReadingCount).toBe(EXPECTED_READINGS_PER_DAY);
  });

  it('computes correct mean for known values', () => {
    const glucose = [100, 120, 140, 160, 180].map((v) => ({ value: v, observedAt: now }));
    const result = computeDailyMetrics(glucose, [], [], []);
    expect(result.glucoseMean).toBe(140);
    expect(result.glucoseMin).toBe(100);
    expect(result.glucoseMax).toBe(180);
    expect(result.readingCount).toBe(5);
  });

  it('computes time in range correctly', () => {
    // 70-180 is in-range. 3 of 5 are in range (100, 120, 140). 160 and 180 are in-range too.
    // Actually: 100, 120, 140, 160, 180 — all in range [70, 180]
    const glucose = [100, 120, 140, 160, 180].map((v) => ({ value: v, observedAt: now }));
    const result = computeDailyMetrics(glucose, [], [], []);
    expect(result.timeInRange).toBe(1.0); // All in range
    expect(result.timeBelowRange).toBe(0);
    expect(result.timeAboveRange).toBe(0);
  });

  it('detects below-range readings', () => {
    const glucose = [50, 60, 100, 150, 200].map((v) => ({ value: v, observedAt: now }));
    const result = computeDailyMetrics(glucose, [], [], []);
    expect(result.timeBelowRange).toBe(0.4); // 2 of 5
    expect(result.timeAboveRange).toBe(0.2); // 1 of 5
    expect(result.timeInRange).toBe(0.4); // 2 of 5
  });

  it('computes standard deviation', () => {
    const glucose = [100, 100, 100, 100].map((v) => ({ value: v, observedAt: now }));
    const result = computeDailyMetrics(glucose, [], [], []);
    expect(result.glucoseStdDev).toBe(0);
  });

  it('sums insulin and carbs', () => {
    const insulin = [{ value: 4.0 }, { value: 6.0 }, { value: 3.5 }];
    const meals = [{ value: 30 }, { value: 50 }, { value: 60 }];
    const activity = [{ value: 30 }];
    const result = computeDailyMetrics([], insulin, meals, activity);
    expect(result.totalInsulin).toBe(13.5);
    expect(result.totalCarbs).toBe(140);
    expect(result.activityMinutes).toBe(30);
  });
});
