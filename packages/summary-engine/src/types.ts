/**
 * Enhanced visit-prep summary types with provenance and i18n.
 *
 * Design principles:
 * - Every claim cites its source data
 * - Facts, trends, and discussion points are clearly separated
 * - No unsupported clinical recommendations
 * - Export-friendly structure
 */

export type SummaryLocale = 'en' | 'fr';

export interface VisitPrepSummary {
  version: string;
  locale: SummaryLocale;
  generatedAt: string;
  patient: {
    name: string;
    age: string;
    diagnosisDate: string | null;
  };
  sections: SummarySection[];
}

export interface SummarySection {
  type: 'facts' | 'trends' | 'discussion';
  title: string;
  items: SummaryItem[];
}

export interface SummaryItem {
  text: string;
  citations: Citation[];
}

export interface Citation {
  type: 'risk' | 'metric' | 'observation' | 'alert' | 'task' | 'device';
  id: string;
  label: string;
}

/** Input data for summary composition — aggregated from DB. */
export interface SummaryInput {
  patient: {
    name: string;
    age: number;
    diagnosisDate: string | null;
  };
  risk: {
    id: string;
    tier: string;
    score: number;
    topFactors: { name: string; value: number }[];
  } | null;
  metrics: {
    avgGlucose: number | null;
    prevAvgGlucose: number | null;
    timeInRange: number | null;
    prevTimeInRange: number | null;
    latestHbA1c: number | null;
    latestHbA1cId: string | null;
    adherence: number | null;
  };
  openTasks: { id: string; title: string }[];
  activeAlerts: { id: string; explanation: string }[];
  devices: { id: string; type: string; status: string; lastSyncHoursAgo: number | null }[];
}

export const SUMMARY_VERSION = 'visit-prep-v2';
