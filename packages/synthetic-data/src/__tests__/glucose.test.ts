import { describe, it, expect } from 'vitest';
import { createRng } from '../rng';
import { ARCHETYPES } from '../archetypes';
import { generateGlucoseReadings } from '../generators/glucose';

describe('generateGlucoseReadings', () => {
  const startDate = new Date('2026-03-01');

  it('generates readings for well-controlled archetype', () => {
    const rng = createRng(42);
    const readings = generateGlucoseReadings(rng, ARCHETYPES['well-controlled'], startDate);

    expect(readings.length).toBeGreaterThan(0);
    expect(readings[0]!.type).toBe('GLUCOSE');
    expect(readings[0]!.unit).toBe('mg/dL');
  });

  it('produces fewer readings for non-adherent archetype (lower coverage)', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);
    const wellControlled = generateGlucoseReadings(rng1, ARCHETYPES['well-controlled'], startDate);
    const nonAdherent = generateGlucoseReadings(rng2, ARCHETYPES['non-adherent'], startDate);

    // Non-adherent has 0.45 coverage vs 0.95
    expect(nonAdherent.length).toBeLessThan(wellControlled.length);
  });

  it('glucose values stay in physiological range', () => {
    const rng = createRng(42);
    const readings = generateGlucoseReadings(rng, ARCHETYPES['high-risk'], startDate);

    for (const r of readings) {
      expect(r.value).toBeGreaterThanOrEqual(40);
      expect(r.value).toBeLessThanOrEqual(400);
    }
  });

  it('is deterministic', () => {
    const rng1 = createRng(100);
    const rng2 = createRng(100);
    const r1 = generateGlucoseReadings(rng1, ARCHETYPES['declining'], startDate);
    const r2 = generateGlucoseReadings(rng2, ARCHETYPES['declining'], startDate);

    expect(r1.length).toBe(r2.length);
    expect(r1[0]!.value).toBe(r2[0]!.value);
    expect(r1[r1.length - 1]!.value).toBe(r2[r2.length - 1]!.value);
  });
});
