import { describe, it, expect } from 'vitest';
import { createRng } from '../rng';
import { generatePatient } from '../generators/patient';

describe('generatePatient', () => {
  it('produces deterministic output for the same seed and index', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);
    const p1 = generatePatient(rng1, 0);
    const p2 = generatePatient(rng2, 0);
    expect(p1.firstName).toBe(p2.firstName);
    expect(p1.lastName).toBe(p2.lastName);
    expect(p1.externalRef).toBe(p2.externalRef);
  });

  it('generates valid patient fields', () => {
    const rng = createRng(42);
    const patient = generatePatient(rng, 5);

    expect(patient.firstName.length).toBeGreaterThan(0);
    expect(patient.lastName.length).toBeGreaterThan(0);
    expect(patient.birthDate).toBeInstanceOf(Date);
    expect(patient.diagnosisDate).toBeInstanceOf(Date);
    expect(['M', 'F']).toContain(patient.sexAtBirth);
    expect(['en', 'fr']).toContain(patient.primaryLanguage);
    expect(patient.externalRef).toBe('synth-patient-005');
  });

  it('birth date is before diagnosis date', () => {
    const rng = createRng(42);
    const patient = generatePatient(rng, 0);
    expect(patient.birthDate.getTime()).toBeLessThan(patient.diagnosisDate.getTime());
  });
});
