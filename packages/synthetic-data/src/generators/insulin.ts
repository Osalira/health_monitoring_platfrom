import type { ArchetypeConfig } from '../archetypes';
import { type Rng, randGaussian, randInt } from '../rng';

export interface GeneratedInsulin {
  type: 'INSULIN';
  value: number;
  unit: string;
  observedAt: Date;
  sourceType: string;
  metadata: { subType: 'bolus' | 'basal'; reason?: string };
}

/**
 * Generate insulin events: meal boluses + basal rate changes.
 */
export function generateInsulinEvents(
  rng: Rng,
  archetype: ArchetypeConfig,
  startDate: Date,
): GeneratedInsulin[] {
  const events: GeneratedInsulin[] = [];

  for (let day = 0; day < archetype.historyDays; day++) {
    const dayStart = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);

    // Meal boluses (around breakfast, lunch, dinner)
    const mealHours = [7, 12, 18];
    for (const hour of mealHours) {
      const minuteOffset = randInt(rng, -30, 30);
      const time = new Date(dayStart.getTime() + (hour * 60 + minuteOffset) * 60 * 1000);
      const dose = Math.max(0.5, randGaussian(rng, archetype.hasPump ? 4 : 6, 2));

      events.push({
        type: 'INSULIN',
        value: Math.round(dose * 10) / 10,
        unit: 'units',
        observedAt: time,
        sourceType: archetype.hasPump ? 'pump' : 'pen',
        metadata: { subType: 'bolus', reason: 'meal' },
      });
    }

    // Basal changes (1-2 per day for pump users)
    if (archetype.hasPump) {
      const basalTime = new Date(dayStart.getTime() + randInt(rng, 0, 12) * 60 * 60 * 1000);
      events.push({
        type: 'INSULIN',
        value: Math.round(randGaussian(rng, 0.8, 0.2) * 10) / 10,
        unit: 'units/hr',
        observedAt: basalTime,
        sourceType: 'pump',
        metadata: { subType: 'basal' },
      });
    }
  }

  return events;
}
