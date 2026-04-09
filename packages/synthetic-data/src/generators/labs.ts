import type { ArchetypeConfig } from '../archetypes';
import { type Rng, randGaussian, randInt } from '../rng';

export interface GeneratedLab {
  type: 'LAB';
  value: number;
  unit: string;
  observedAt: Date;
  sourceType: string;
  metadata: { labType: string };
}

/**
 * Generate lab results (HbA1c, fasting glucose).
 */
export function generateLabs(
  rng: Rng,
  archetype: ArchetypeConfig,
  startDate: Date,
): GeneratedLab[] {
  const labs: GeneratedLab[] = [];

  // HbA1c — one recent result
  const daysAgo = randInt(rng, 7, 60);
  labs.push({
    type: 'LAB',
    value: Math.round(randGaussian(rng, archetype.hba1c, 0.3) * 10) / 10,
    unit: '%',
    observedAt: new Date(startDate.getTime() + (archetype.historyDays - daysAgo) * 24 * 60 * 60 * 1000),
    sourceType: 'lab',
    metadata: { labType: 'HbA1c' },
  });

  // Previous HbA1c (3 months earlier, if enough history)
  if (archetype.historyDays >= 30) {
    const prevHba1c = archetype.id === 'declining'
      ? archetype.hba1c - 0.8 // was better before
      : archetype.hba1c + randGaussian(rng, 0, 0.3);
    labs.push({
      type: 'LAB',
      value: Math.round(Math.max(4.5, prevHba1c) * 10) / 10,
      unit: '%',
      observedAt: new Date(startDate.getTime()),
      sourceType: 'lab',
      metadata: { labType: 'HbA1c' },
    });
  }

  return labs;
}
