import type { ArchetypeConfig } from '../archetypes';
import { type Rng, randPick, randInt } from '../rng';

export interface GeneratedTask {
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueAt: Date;
}

const TASK_TEMPLATES = [
  { title: 'Review glucose trends', description: 'Analyze 2-week CGM data patterns', priority: 'MEDIUM' as const },
  { title: 'Follow up on HbA1c', description: 'Discuss latest lab results with patient', priority: 'HIGH' as const },
  { title: 'Adjust basal rates', description: 'Review overnight patterns and adjust pump settings', priority: 'MEDIUM' as const },
  { title: 'Education session', description: 'Carb counting refresher and bolus timing', priority: 'LOW' as const },
  { title: 'Device troubleshooting', description: 'Address CGM connectivity issues', priority: 'HIGH' as const },
  { title: 'Schedule follow-up', description: 'Book next clinic visit within 4 weeks', priority: 'MEDIUM' as const },
  { title: 'Review meal logs', description: 'Check food diary and carb accuracy', priority: 'LOW' as const },
  { title: 'Contact caregiver', description: 'Update parent/caregiver on treatment plan', priority: 'MEDIUM' as const },
  { title: 'Urgent glucose review', description: 'Multiple severe lows detected — immediate review needed', priority: 'URGENT' as const },
  { title: 'Initiate pump training', description: 'Patient ready for pump therapy education', priority: 'MEDIUM' as const },
];

export function generateTasks(
  rng: Rng,
  archetype: ArchetypeConfig,
  startDate: Date,
): GeneratedTask[] {
  const tasks: GeneratedTask[] = [];

  for (let i = 0; i < archetype.taskCount; i++) {
    const template = randPick(rng, TASK_TEMPLATES);
    const daysUntilDue = randInt(rng, 1, 14);
    const now = new Date(startDate.getTime() + archetype.historyDays * 24 * 60 * 60 * 1000);

    tasks.push({
      ...template,
      status: i === 0 ? 'OPEN' : randPick(rng, ['OPEN', 'IN_PROGRESS'] as const),
      dueAt: new Date(now.getTime() + daysUntilDue * 24 * 60 * 60 * 1000),
    });
  }

  return tasks;
}
