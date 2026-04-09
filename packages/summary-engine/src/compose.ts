/**
 * Visit-prep summary composition.
 *
 * Takes aggregated patient data and produces a structured, export-friendly
 * summary with provenance citations.
 */

import type {
  SummaryLocale,
  VisitPrepSummary,
  SummarySection,
  SummaryItem,
  SummaryInput,
  Citation,
} from './types';
import { SUMMARY_VERSION } from './types';
import { sectionTitles, factTemplates, trendTemplates, discussionTemplates } from './templates';

export function composeVisitPrep(
  input: SummaryInput,
  locale: SummaryLocale = 'en',
): VisitPrepSummary {
  const facts = buildFacts(input, locale);
  const trends = buildTrends(input, locale);
  const discussion = buildDiscussion(input, locale);

  return {
    version: SUMMARY_VERSION,
    locale,
    generatedAt: new Date().toISOString(),
    patient: {
      name: input.patient.name,
      age: String(input.patient.age),
      diagnosisDate: input.patient.diagnosisDate,
    },
    sections: [facts, trends, discussion].filter((s) => s.items.length > 0),
  };
}

function buildFacts(input: SummaryInput, locale: SummaryLocale): SummarySection {
  const items: SummaryItem[] = [];

  // Risk
  if (input.risk) {
    items.push({
      text: factTemplates.riskTier(input.risk.tier, input.risk.score, locale),
      citations: [{ type: 'risk', id: input.risk.id, label: `Risk ${input.risk.tier}` }],
    });
  }

  // HbA1c
  if (input.metrics.latestHbA1c != null) {
    const cit: Citation[] = [];
    if (input.metrics.latestHbA1cId) {
      cit.push({ type: 'observation', id: input.metrics.latestHbA1cId, label: 'HbA1c lab' });
    }
    items.push({ text: factTemplates.hba1c(input.metrics.latestHbA1c, locale), citations: cit });
  }

  // Average glucose
  if (input.metrics.avgGlucose != null) {
    items.push({
      text: factTemplates.avgGlucose(input.metrics.avgGlucose, locale),
      citations: [{ type: 'metric', id: 'avg-glucose-7d', label: '7-day avg' }],
    });
  }

  // TIR
  if (input.metrics.timeInRange != null) {
    items.push({
      text: factTemplates.timeInRange(input.metrics.timeInRange, locale),
      citations: [{ type: 'metric', id: 'tir-7d', label: '7-day TIR' }],
    });
  }

  // Adherence
  if (input.metrics.adherence != null) {
    items.push({
      text: factTemplates.adherence(input.metrics.adherence, locale),
      citations: [{ type: 'metric', id: 'adherence-7d', label: '7-day adherence' }],
    });
  }

  // Devices
  for (const device of input.devices) {
    if (device.lastSyncHoursAgo != null) {
      items.push({
        text: factTemplates.deviceSync(device.type, device.lastSyncHoursAgo, locale),
        citations: [{ type: 'device', id: device.id, label: device.type }],
      });
    }
  }

  // Alerts
  if (input.activeAlerts.length > 0) {
    items.push({
      text: factTemplates.alertCount(input.activeAlerts.length, locale),
      citations: input.activeAlerts.map((a) => ({ type: 'alert' as const, id: a.id, label: a.explanation })),
    });
  }

  // Tasks
  if (input.openTasks.length > 0) {
    items.push({
      text: factTemplates.taskCount(input.openTasks.length, locale),
      citations: input.openTasks.map((t) => ({ type: 'task' as const, id: t.id, label: t.title })),
    });
  }

  return { type: 'facts', title: sectionTitles['facts']![locale], items };
}

function buildTrends(input: SummaryInput, locale: SummaryLocale): SummarySection {
  const items: SummaryItem[] = [];

  // Glucose trend
  if (input.metrics.avgGlucose != null && input.metrics.prevAvgGlucose != null) {
    const diff = Math.abs(input.metrics.avgGlucose - input.metrics.prevAvgGlucose);
    if (diff >= 5) {
      items.push({
        text: trendTemplates.glucoseChange(input.metrics.avgGlucose, input.metrics.prevAvgGlucose, locale),
        citations: [{ type: 'metric', id: 'glucose-trend', label: '7d vs prior' }],
      });
    }
  }

  // TIR trend
  if (input.metrics.timeInRange != null && input.metrics.prevTimeInRange != null) {
    const diff = Math.abs(input.metrics.timeInRange - input.metrics.prevTimeInRange);
    if (diff >= 0.03) {
      items.push({
        text: trendTemplates.tirChange(input.metrics.timeInRange, input.metrics.prevTimeInRange, locale),
        citations: [{ type: 'metric', id: 'tir-trend', label: 'TIR trend' }],
      });
    }
  }

  return { type: 'trends', title: sectionTitles['trends']![locale], items };
}

function buildDiscussion(input: SummaryInput, locale: SummaryLocale): SummarySection {
  const items: SummaryItem[] = [];

  if (input.metrics.timeInRange != null && input.metrics.timeInRange < 0.7) {
    items.push({ text: discussionTemplates.lowTIR(locale), citations: [] });
  }

  if (input.risk && (input.risk.tier === 'HIGH' || input.risk.tier === 'CRITICAL')) {
    items.push({
      text: discussionTemplates.highRisk(locale),
      citations: [{ type: 'risk', id: input.risk.id, label: input.risk.tier }],
    });
  }

  if (input.metrics.adherence != null && input.metrics.adherence < 0.8) {
    items.push({ text: discussionTemplates.lowAdherence(locale), citations: [] });
  }

  const disconnected = input.devices.find(
    (d) => d.lastSyncHoursAgo != null && d.lastSyncHoursAgo > 24,
  );
  if (disconnected) {
    items.push({
      text: discussionTemplates.deviceDisconnected(locale),
      citations: [{ type: 'device', id: disconnected.id, label: disconnected.type }],
    });
  }

  if (input.activeAlerts.length > 0) {
    items.push({ text: discussionTemplates.openAlerts(locale), citations: [] });
  }

  if (input.openTasks.length > 0) {
    items.push({ text: discussionTemplates.pendingTasks(locale), citations: [] });
  }

  return { type: 'discussion', title: sectionTitles['discussion']![locale], items };
}
