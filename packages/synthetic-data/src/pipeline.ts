/**
 * Synthetic data pipeline orchestrator.
 *
 * Generates a complete patient story: demographics, devices, observations,
 * clinical events, and risk for a given archetype.
 */

import { createRng } from './rng';
import { type ArchetypeConfig, ARCHETYPES, ARCHETYPE_IDS } from './archetypes';
import { generatePatient, type GeneratedPatient } from './generators/patient';
import { generateDevices, type GeneratedDevice } from './generators/device';
import { generateGlucoseReadings, type GeneratedGlucose } from './generators/glucose';
import { generateInsulinEvents, type GeneratedInsulin } from './generators/insulin';
import { generateMeals, type GeneratedMeal } from './generators/meals';
import { generateActivity, type GeneratedActivity } from './generators/activity';
import { generateLabs, type GeneratedLab } from './generators/labs';
import { generateAlerts, type GeneratedAlert } from './generators/alerts';
import { generateTasks, type GeneratedTask } from './generators/tasks';
import { generateRiskAssessment, type GeneratedRisk } from './generators/risk';

export interface PatientStory {
  patient: GeneratedPatient;
  archetype: ArchetypeConfig;
  devices: GeneratedDevice[];
  glucose: GeneratedGlucose[];
  insulin: GeneratedInsulin[];
  meals: GeneratedMeal[];
  activity: GeneratedActivity[];
  labs: GeneratedLab[];
  alerts: GeneratedAlert[];
  tasks: GeneratedTask[];
  risk: GeneratedRisk;
}

/**
 * Generate a single patient story.
 *
 * @param index - Patient index (used for seed and external ref)
 * @param archetype - Archetype config driving all generation
 * @param baseSeed - Optional base seed (default 42)
 */
export function generatePatientStory(
  index: number,
  archetype: ArchetypeConfig,
  baseSeed = 42,
): PatientStory {
  const rng = createRng(baseSeed + index * 1000);
  const now = new Date();
  const startDate = new Date(now.getTime() - archetype.historyDays * 24 * 60 * 60 * 1000);

  const patient = generatePatient(rng, index);
  const devices = generateDevices(rng, index, archetype);
  const glucose = generateGlucoseReadings(rng, archetype, startDate);
  const insulin = generateInsulinEvents(rng, archetype, startDate);
  const meals = generateMeals(rng, archetype, startDate);
  const activity = generateActivity(rng, archetype, startDate);
  const labs = generateLabs(rng, archetype, startDate);
  const alerts = generateAlerts(rng, archetype, startDate);
  const tasks = generateTasks(rng, archetype, startDate);
  const risk = generateRiskAssessment(rng, archetype, startDate);

  return {
    patient,
    archetype,
    devices,
    glucose,
    insulin,
    meals,
    activity,
    labs,
    alerts,
    tasks,
    risk,
  };
}

/**
 * Generate all patient stories for the demo dataset.
 *
 * @param patientsPerArchetype - Number of patients per archetype (default 6)
 * @param baseSeed - Base seed for deterministic generation
 */
export function generateAllStories(
  patientsPerArchetype = 6,
  baseSeed = 42,
): PatientStory[] {
  const stories: PatientStory[] = [];
  let index = 0;

  for (const archetypeId of ARCHETYPE_IDS) {
    const archetype = ARCHETYPES[archetypeId];
    for (let i = 0; i < patientsPerArchetype; i++) {
      stories.push(generatePatientStory(index, archetype, baseSeed));
      index++;
    }
  }

  return stories;
}
