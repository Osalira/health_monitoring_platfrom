import { type Rng, randPick, randInt } from '../rng';

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery',
  'Emery', 'Skyler', 'Reese', 'Finley', 'Harper', 'Rowan', 'Eden', 'Sage',
  'Blake', 'Dakota', 'Hayden', 'Kendall', 'Logan', 'Parker', 'Phoenix', 'River',
  'Cameron', 'Drew', 'Jamie', 'Kai', 'Lennox', 'Oakley',
];

const LAST_NAMES = [
  'Martin', 'Chen', 'Patel', 'Nguyen', 'Garcia', 'Kim', 'Tremblay', 'Singh',
  'Wilson', 'Brown', 'Lavoie', 'Moreau', 'Roy', 'Thompson', 'Clark', 'White',
  'Dubois', 'Lee', 'Anderson', 'Robinson', 'Mitchell', 'Scott', 'Hall', 'Young',
  'Allen', 'King', 'Wright', 'Hill', 'Green', 'Adams',
];

export interface GeneratedPatient {
  firstName: string;
  lastName: string;
  birthDate: Date;
  sexAtBirth: string;
  diagnosisDate: Date;
  primaryLanguage: string;
  externalRef: string;
}

export function generatePatient(rng: Rng, index: number): GeneratedPatient {
  const firstName = randPick(rng, FIRST_NAMES);
  const lastName = randPick(rng, LAST_NAMES);
  const sex = randPick(rng, ['M', 'F']);
  const language = randPick(rng, ['en', 'en', 'en', 'fr', 'fr']); // 60% EN, 40% FR

  // Age 8-45 at diagnosis, diagnosed 1-20 years ago
  const yearsAgo = randInt(rng, 1, 20);
  const ageAtDiagnosis = randInt(rng, 8, 35);
  const now = new Date();
  const diagnosisYear = now.getFullYear() - yearsAgo;
  const birthYear = diagnosisYear - ageAtDiagnosis;
  const birthMonth = randInt(rng, 0, 11);
  const birthDay = randInt(rng, 1, 28);
  const diagMonth = randInt(rng, 0, 11);

  return {
    firstName,
    lastName,
    birthDate: new Date(birthYear, birthMonth, birthDay),
    sexAtBirth: sex,
    diagnosisDate: new Date(diagnosisYear, diagMonth, 1),
    primaryLanguage: language,
    externalRef: `synth-patient-${String(index).padStart(3, '0')}`,
  };
}
