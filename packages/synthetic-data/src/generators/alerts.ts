import type { ArchetypeConfig } from '../archetypes';
import { type Rng, randPick, randInt } from '../rng';

export interface GeneratedAlert {
  type: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  triggeredAt: Date;
  explanation: string;
}

const ALERT_TEMPLATES: { type: string; severity: GeneratedAlert['severity']; explanation: string }[] = [
  { type: 'high_glucose_sustained', severity: 'WARNING', explanation: 'Glucose above 250 mg/dL for >2 hours' },
  { type: 'low_glucose', severity: 'CRITICAL', explanation: 'Glucose below 54 mg/dL detected' },
  { type: 'sensor_gap', severity: 'INFO', explanation: 'CGM data gap exceeding 6 hours' },
  { type: 'rising_trend', severity: 'WARNING', explanation: 'Upward glucose trend persisting >3 hours' },
  { type: 'missed_bolus', severity: 'WARNING', explanation: 'Meal detected without corresponding bolus' },
  { type: 'device_disconnect', severity: 'INFO', explanation: 'CGM not synced in >24 hours' },
  { type: 'hba1c_elevated', severity: 'WARNING', explanation: 'Latest HbA1c above target range' },
  { type: 'high_variability', severity: 'WARNING', explanation: 'Glucose coefficient of variation >36%' },
];

export function generateAlerts(
  rng: Rng,
  archetype: ArchetypeConfig,
  startDate: Date,
): GeneratedAlert[] {
  const alerts: GeneratedAlert[] = [];

  for (let i = 0; i < archetype.alertCount; i++) {
    const template = randPick(rng, ALERT_TEMPLATES);
    const daysAgo = randInt(rng, 0, Math.min(7, archetype.historyDays));
    alerts.push({
      ...template,
      status: i === 0 ? 'ACTIVE' : randPick(rng, ['ACTIVE', 'ACKNOWLEDGED'] as const),
      triggeredAt: new Date(startDate.getTime() + (archetype.historyDays - daysAgo) * 24 * 60 * 60 * 1000),
    });
  }

  return alerts;
}
