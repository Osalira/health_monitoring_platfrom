import { describe, it, expect } from 'vitest';
import { generatePatientStory, generateAllStories } from '../pipeline';
import { ARCHETYPES } from '../archetypes';

describe('generatePatientStory', () => {
  it('generates a complete story', () => {
    const story = generatePatientStory(0, ARCHETYPES['well-controlled']);

    expect(story.patient.externalRef).toBe('synth-patient-000');
    expect(story.devices.length).toBeGreaterThan(0);
    expect(story.glucose.length).toBeGreaterThan(0);
    expect(story.insulin.length).toBeGreaterThan(0);
    expect(story.meals.length).toBeGreaterThan(0);
    expect(story.labs.length).toBeGreaterThan(0);
    expect(story.risk.tier).toBe('LOW');
  });

  it('is deterministic', () => {
    const s1 = generatePatientStory(5, ARCHETYPES['declining'], 42);
    const s2 = generatePatientStory(5, ARCHETYPES['declining'], 42);

    expect(s1.patient.firstName).toBe(s2.patient.firstName);
    expect(s1.glucose.length).toBe(s2.glucose.length);
    expect(s1.risk.score).toBe(s2.risk.score);
  });

  it('archetype drives data characteristics', () => {
    const wellControlled = generatePatientStory(0, ARCHETYPES['well-controlled']);
    const highRisk = generatePatientStory(1, ARCHETYPES['high-risk']);

    // High-risk has more alerts and tasks
    expect(highRisk.alerts.length).toBeGreaterThan(wellControlled.alerts.length);
    expect(highRisk.tasks.length).toBeGreaterThan(wellControlled.tasks.length);

    // Risk tiers match
    expect(wellControlled.risk.tier).toBe('LOW');
    expect(highRisk.risk.tier).toBe('CRITICAL');
  });
});

describe('generateAllStories', () => {
  it('generates correct number of stories', () => {
    const stories = generateAllStories(2, 42); // 2 per archetype × 5 = 10
    expect(stories).toHaveLength(10);
  });

  it('covers all archetypes', () => {
    const stories = generateAllStories(1, 42);
    const archetypeIds = new Set(stories.map((s) => s.archetype.id));
    expect(archetypeIds.size).toBe(5);
  });

  it('each patient has a unique external ref', () => {
    const stories = generateAllStories(3, 42);
    const refs = stories.map((s) => s.patient.externalRef);
    expect(new Set(refs).size).toBe(refs.length);
  });
});
