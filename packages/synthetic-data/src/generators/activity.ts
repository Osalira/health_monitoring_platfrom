import type { ArchetypeConfig } from '../archetypes';
import { type Rng, randInt, randPick, randChance } from '../rng';

export interface GeneratedActivity {
  type: 'ACTIVITY';
  value: number;
  unit: string;
  observedAt: Date;
  sourceType: string;
  metadata: { activityType: string };
}

const ACTIVITIES = ['walking', 'running', 'cycling', 'swimming', 'gym', 'yoga'];

/**
 * Generate activity/exercise events.
 */
export function generateActivity(
  rng: Rng,
  archetype: ArchetypeConfig,
  startDate: Date,
): GeneratedActivity[] {
  const events: GeneratedActivity[] = [];
  const sessionsPerWeek = archetype.activityPerWeek;

  for (let day = 0; day < archetype.historyDays; day++) {
    // Probability of exercising on any given day
    if (!randChance(rng, sessionsPerWeek / 7)) continue;

    const dayStart = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
    const hour = randPick(rng, [6, 7, 12, 17, 18, 19]);
    const duration = randInt(rng, 20, 75);

    events.push({
      type: 'ACTIVITY',
      value: duration,
      unit: 'minutes',
      observedAt: new Date(dayStart.getTime() + hour * 60 * 60 * 1000),
      sourceType: 'wearable',
      metadata: { activityType: randPick(rng, ACTIVITIES) },
    });
  }

  return events;
}
