/** Synthetic patient and event generators for T1D Command Center. */

// Core utilities
export { createRng, type Rng, randFloat, randInt, randPick, randGaussian, randChance } from './rng';

// Archetypes
export { ARCHETYPES, ARCHETYPE_IDS, type ArchetypeId, type ArchetypeConfig } from './archetypes';

// Individual generators
export { generatePatient, type GeneratedPatient } from './generators/patient';
export { generateDevices, type GeneratedDevice } from './generators/device';
export { generateGlucoseReadings, type GeneratedGlucose } from './generators/glucose';
export { generateInsulinEvents, type GeneratedInsulin } from './generators/insulin';
export { generateMeals, type GeneratedMeal } from './generators/meals';
export { generateActivity, type GeneratedActivity } from './generators/activity';
export { generateLabs, type GeneratedLab } from './generators/labs';
export { generateAlerts, type GeneratedAlert } from './generators/alerts';
export { generateTasks, type GeneratedTask } from './generators/tasks';
export { generateRiskAssessment, type GeneratedRisk } from './generators/risk';

// Pipeline
export { generatePatientStory, generateAllStories, type PatientStory } from './pipeline';
