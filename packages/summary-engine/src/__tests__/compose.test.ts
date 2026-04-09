import { describe, it, expect } from 'vitest';
import { composeVisitPrep } from '../compose';
import { SUMMARY_VERSION, type SummaryInput } from '../types';

function makeInput(overrides: Partial<SummaryInput> = {}): SummaryInput {
  return {
    patient: { name: 'Alex Martin', age: 18, diagnosisDate: '2012-09-01' },
    risk: { id: 'risk-001', tier: 'MODERATE', score: 45, topFactors: [{ name: 'timeInRange', value: 0.45 }] },
    metrics: {
      avgGlucose: 165,
      prevAvgGlucose: 140,
      timeInRange: 0.55,
      prevTimeInRange: 0.72,
      latestHbA1c: 7.8,
      latestHbA1cId: 'obs-hba1c-001',
      adherence: 0.85,
    },
    openTasks: [{ id: 'task-001', title: 'Review glucose trends' }],
    activeAlerts: [{ id: 'alert-001', explanation: 'Glucose above 250 for >2h' }],
    devices: [{ id: 'dev-001', type: 'CGM', status: 'ACTIVE', lastSyncHoursAgo: 3 }],
    ...overrides,
  };
}

describe('composeVisitPrep', () => {
  it('returns correct version and locale', () => {
    const result = composeVisitPrep(makeInput(), 'en');
    expect(result.version).toBe(SUMMARY_VERSION);
    expect(result.locale).toBe('en');
    expect(result.patient.name).toBe('Alex Martin');
  });

  it('generates facts section with citations', () => {
    const result = composeVisitPrep(makeInput(), 'en');
    const facts = result.sections.find((s) => s.type === 'facts');
    expect(facts).toBeDefined();
    expect(facts!.items.length).toBeGreaterThan(0);

    // HbA1c should cite the observation
    const hba1cItem = facts!.items.find((i) => i.text.includes('HbA1c'));
    expect(hba1cItem).toBeDefined();
    expect(hba1cItem!.citations.length).toBeGreaterThan(0);
    expect(hba1cItem!.citations[0]!.id).toBe('obs-hba1c-001');
  });

  it('generates trends section when data changes', () => {
    const result = composeVisitPrep(makeInput(), 'en');
    const trends = result.sections.find((s) => s.type === 'trends');
    expect(trends).toBeDefined();
    expect(trends!.items.length).toBeGreaterThan(0);

    // Glucose increased by 25 mg/dL
    const glucoseTrend = trends!.items.find((i) => i.text.includes('increased'));
    expect(glucoseTrend).toBeDefined();
  });

  it('generates discussion points for low TIR', () => {
    const result = composeVisitPrep(makeInput({ metrics: { ...makeInput().metrics, timeInRange: 0.5 } }), 'en');
    const discussion = result.sections.find((s) => s.type === 'discussion');
    expect(discussion).toBeDefined();
    expect(discussion!.items.some((i) => i.text.includes('70%'))).toBe(true);
  });

  it('skips trends section when no prior data', () => {
    const input = makeInput({
      metrics: { ...makeInput().metrics, prevAvgGlucose: null, prevTimeInRange: null },
    });
    const result = composeVisitPrep(input, 'en');
    const trends = result.sections.find((s) => s.type === 'trends');
    // Trends section should be empty (filtered out)
    expect(trends).toBeUndefined();
  });

  it('generates in French', () => {
    const result = composeVisitPrep(makeInput(), 'fr');
    expect(result.locale).toBe('fr');

    const facts = result.sections.find((s) => s.type === 'facts');
    expect(facts!.title).toBe('État actuel');

    // HbA1c in French
    const hba1cItem = facts!.items.find((i) => i.text.includes('HbA1c'));
    expect(hba1cItem!.text).toContain('dernier');
  });

  it('includes device citations', () => {
    const result = composeVisitPrep(makeInput(), 'en');
    const facts = result.sections.find((s) => s.type === 'facts');
    const deviceItem = facts!.items.find((i) => i.text.includes('synced'));
    expect(deviceItem).toBeDefined();
    expect(deviceItem!.citations[0]!.type).toBe('device');
  });

  it('flags disconnected device in discussion', () => {
    const input = makeInput({
      devices: [{ id: 'dev-001', type: 'CGM', status: 'DISCONNECTED', lastSyncHoursAgo: 48 }],
    });
    const result = composeVisitPrep(input, 'en');
    const discussion = result.sections.find((s) => s.type === 'discussion');
    expect(discussion!.items.some((i) => i.text.includes('not synced'))).toBe(true);
  });

  it('handles empty data gracefully', () => {
    const input = makeInput({
      risk: null,
      metrics: {
        avgGlucose: null, prevAvgGlucose: null,
        timeInRange: null, prevTimeInRange: null,
        latestHbA1c: null, latestHbA1cId: null,
        adherence: null,
      },
      openTasks: [],
      activeAlerts: [],
      devices: [],
    });
    const result = composeVisitPrep(input, 'en');
    expect(result.sections.length).toBe(0); // All sections empty → filtered
  });

  it('cites alert IDs in facts section', () => {
    const input = makeInput({
      activeAlerts: [
        { id: 'a1', explanation: 'High glucose' },
        { id: 'a2', explanation: 'Sensor gap' },
      ],
    });
    const result = composeVisitPrep(input, 'en');
    const facts = result.sections.find((s) => s.type === 'facts');
    const alertItem = facts!.items.find((i) => i.text.includes('alert'));
    expect(alertItem!.citations.length).toBe(2);
  });
});
