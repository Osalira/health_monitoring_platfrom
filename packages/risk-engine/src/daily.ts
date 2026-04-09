/**
 * Daily metric computation.
 *
 * Computes glucose statistics, time-in-range, and event totals for a single day.
 * All inputs are plain arrays — no database dependency.
 *
 * Glucose target range: 70-180 mg/dL (standard T1D target).
 */

export interface GlucoseReading {
  value: number;
  observedAt: Date;
}

export interface InsulinEvent {
  value: number;
}

export interface MealEvent {
  value: number;
}

export interface ActivityEvent {
  value: number;
}

export interface DailyMetricData {
  glucoseMean: number | null;
  glucoseStdDev: number | null;
  glucoseMin: number | null;
  glucoseMax: number | null;
  timeInRange: number | null;
  timeBelowRange: number | null;
  timeAboveRange: number | null;
  readingCount: number;
  expectedReadingCount: number;
  totalInsulin: number | null;
  totalCarbs: number | null;
  activityMinutes: number | null;
}

const TARGET_LOW = 70;
const TARGET_HIGH = 180;

/**
 * Expected CGM readings per day (every 5 minutes = 288).
 */
export const EXPECTED_READINGS_PER_DAY = 288;

export function computeDailyMetrics(
  glucose: GlucoseReading[],
  insulin: InsulinEvent[],
  meals: MealEvent[],
  activity: ActivityEvent[],
): DailyMetricData {
  const readingCount = glucose.length;

  // Glucose statistics
  let glucoseMean: number | null = null;
  let glucoseStdDev: number | null = null;
  let glucoseMin: number | null = null;
  let glucoseMax: number | null = null;
  let timeInRange: number | null = null;
  let timeBelowRange: number | null = null;
  let timeAboveRange: number | null = null;

  if (readingCount > 0) {
    const values = glucose.map((g) => g.value);
    const sum = values.reduce((a, b) => a + b, 0);
    glucoseMean = sum / readingCount;
    glucoseMin = Math.min(...values);
    glucoseMax = Math.max(...values);

    if (readingCount > 1) {
      const variance = values.reduce((acc, v) => acc + (v - glucoseMean!) ** 2, 0) / (readingCount - 1);
      glucoseStdDev = Math.sqrt(variance);
    } else {
      glucoseStdDev = 0;
    }

    const inRange = values.filter((v) => v >= TARGET_LOW && v <= TARGET_HIGH).length;
    const belowRange = values.filter((v) => v < TARGET_LOW).length;
    const aboveRange = values.filter((v) => v > TARGET_HIGH).length;
    timeInRange = inRange / readingCount;
    timeBelowRange = belowRange / readingCount;
    timeAboveRange = aboveRange / readingCount;
  }

  // Event totals
  const totalInsulin = insulin.length > 0 ? insulin.reduce((a, e) => a + e.value, 0) : null;
  const totalCarbs = meals.length > 0 ? meals.reduce((a, e) => a + e.value, 0) : null;
  const activityMinutes = activity.length > 0 ? activity.reduce((a, e) => a + e.value, 0) : null;

  return {
    glucoseMean: glucoseMean != null ? round2(glucoseMean) : null,
    glucoseStdDev: glucoseStdDev != null ? round2(glucoseStdDev) : null,
    glucoseMin,
    glucoseMax,
    timeInRange: timeInRange != null ? round4(timeInRange) : null,
    timeBelowRange: timeBelowRange != null ? round4(timeBelowRange) : null,
    timeAboveRange: timeAboveRange != null ? round4(timeAboveRange) : null,
    readingCount,
    expectedReadingCount: EXPECTED_READINGS_PER_DAY,
    totalInsulin: totalInsulin != null ? round2(totalInsulin) : null,
    totalCarbs: totalCarbs != null ? round2(totalCarbs) : null,
    activityMinutes: activityMinutes != null ? round2(activityMinutes) : null,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
