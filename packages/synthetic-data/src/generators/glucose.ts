import type { ArchetypeConfig } from '../archetypes';
import { type Rng, randGaussian, randChance } from '../rng';

export interface GeneratedGlucose {
  type: 'GLUCOSE';
  value: number;
  unit: string;
  observedAt: Date;
  sourceType: string;
}

/**
 * Generate CGM glucose readings every 5 minutes.
 * Uses a random walk with mean-reversion to create realistic-looking traces.
 */
export function generateGlucoseReadings(
  rng: Rng,
  archetype: ArchetypeConfig,
  startDate: Date,
): GeneratedGlucose[] {
  const readings: GeneratedGlucose[] = [];
  const intervalMs = 5 * 60 * 1000; // 5 minutes
  const totalReadings = archetype.historyDays * 24 * 12; // 12 per hour
  const { glucoseMean, glucoseStdDev, cgmCoverage } = archetype;

  let currentValue = glucoseMean;

  for (let i = 0; i < totalReadings; i++) {
    // Skip reading based on coverage (simulates gaps)
    if (!randChance(rng, cgmCoverage)) continue;

    // Time-of-day effect: higher after meals (~8am, ~12pm, ~6pm)
    const time = new Date(startDate.getTime() + i * intervalMs);
    const hour = time.getHours();
    const mealBump =
      (hour >= 7 && hour <= 9) ? 30 :
      (hour >= 12 && hour <= 14) ? 25 :
      (hour >= 18 && hour <= 20) ? 35 :
      0;

    // Random walk with mean-reversion
    const target = glucoseMean + mealBump;
    const reversion = (target - currentValue) * 0.1;
    const noise = randGaussian(rng, 0, glucoseStdDev * 0.3);
    currentValue = Math.max(40, Math.min(400, currentValue + reversion + noise));

    readings.push({
      type: 'GLUCOSE',
      value: Math.round(currentValue),
      unit: 'mg/dL',
      observedAt: time,
      sourceType: 'cgm',
    });
  }

  return readings;
}
