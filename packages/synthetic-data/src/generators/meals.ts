import type { ArchetypeConfig } from '../archetypes';
import { type Rng, randGaussian, randInt, randChance } from '../rng';

export interface GeneratedMeal {
  type: 'CARBS';
  value: number;
  unit: string;
  observedAt: Date;
  sourceType: string;
}

/**
 * Generate meal/carb entries logged throughout the day.
 */
export function generateMeals(
  rng: Rng,
  archetype: ArchetypeConfig,
  startDate: Date,
): GeneratedMeal[] {
  const meals: GeneratedMeal[] = [];

  for (let day = 0; day < archetype.historyDays; day++) {
    const dayStart = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);

    // Breakfast (7-9am)
    if (randChance(rng, 0.85)) {
      meals.push(makeMeal(rng, dayStart, randInt(rng, 7, 9), 30, 15));
    }

    // Lunch (11:30-13:30)
    if (randChance(rng, 0.9)) {
      meals.push(makeMeal(rng, dayStart, randInt(rng, 11, 13), 50, 20));
    }

    // Dinner (17:30-19:30)
    if (randChance(rng, 0.95)) {
      meals.push(makeMeal(rng, dayStart, randInt(rng, 17, 19), 60, 25));
    }

    // Snack (occasionally)
    if (randChance(rng, archetype.mealsPerDay > 3 ? 0.6 : 0.3)) {
      meals.push(makeMeal(rng, dayStart, randInt(rng, 14, 16), 15, 8));
    }
  }

  return meals;
}

function makeMeal(rng: Rng, dayStart: Date, hour: number, carbMean: number, carbStd: number): GeneratedMeal {
  const minute = randInt(rng, 0, 59);
  return {
    type: 'CARBS',
    value: Math.max(5, Math.round(randGaussian(rng, carbMean, carbStd))),
    unit: 'g',
    observedAt: new Date(dayStart.getTime() + (hour * 60 + minute) * 60 * 1000),
    sourceType: 'manual',
  };
}
