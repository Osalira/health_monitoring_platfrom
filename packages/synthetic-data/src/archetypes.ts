/**
 * Patient archetypes — each produces a distinct clinical story.
 *
 * Archetype configs drive all generators so that data is internally consistent.
 */

export type ArchetypeId =
  | 'well-controlled'
  | 'declining'
  | 'high-risk'
  | 'newly-diagnosed'
  | 'non-adherent';

export interface ArchetypeConfig {
  id: ArchetypeId;
  label: string;
  /** Mean glucose mg/dL */
  glucoseMean: number;
  /** Glucose standard deviation mg/dL */
  glucoseStdDev: number;
  /** Target time-in-range (70-180) fraction */
  tirTarget: number;
  /** Fraction of CGM readings present (1.0 = complete, 0.5 = half missing) */
  cgmCoverage: number;
  /** Data history in days */
  historyDays: number;
  /** Has insulin pump */
  hasPump: boolean;
  /** Average meals per day */
  mealsPerDay: number;
  /** Activity sessions per week */
  activityPerWeek: number;
  /** Risk tier */
  riskTier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  /** Number of open alerts */
  alertCount: number;
  /** Number of open tasks */
  taskCount: number;
  /** HbA1c % */
  hba1c: number;
}

export const ARCHETYPES: Record<ArchetypeId, ArchetypeConfig> = {
  'well-controlled': {
    id: 'well-controlled',
    label: 'Well-Controlled',
    glucoseMean: 130,
    glucoseStdDev: 25,
    tirTarget: 0.75,
    cgmCoverage: 0.95,
    historyDays: 30,
    hasPump: true,
    mealsPerDay: 3.5,
    activityPerWeek: 4,
    riskTier: 'LOW',
    alertCount: 0,
    taskCount: 1,
    hba1c: 6.8,
  },
  declining: {
    id: 'declining',
    label: 'Declining',
    glucoseMean: 175,
    glucoseStdDev: 45,
    tirTarget: 0.55,
    cgmCoverage: 0.85,
    historyDays: 30,
    hasPump: true,
    mealsPerDay: 3,
    activityPerWeek: 2,
    riskTier: 'MODERATE',
    alertCount: 2,
    taskCount: 3,
    hba1c: 7.8,
  },
  'high-risk': {
    id: 'high-risk',
    label: 'High-Risk',
    glucoseMean: 220,
    glucoseStdDev: 65,
    tirTarget: 0.35,
    cgmCoverage: 0.75,
    historyDays: 30,
    hasPump: false,
    mealsPerDay: 2.5,
    activityPerWeek: 1,
    riskTier: 'CRITICAL',
    alertCount: 4,
    taskCount: 5,
    hba1c: 9.2,
  },
  'newly-diagnosed': {
    id: 'newly-diagnosed',
    label: 'Newly Diagnosed',
    glucoseMean: 165,
    glucoseStdDev: 50,
    tirTarget: 0.5,
    cgmCoverage: 0.7,
    historyDays: 14,
    hasPump: false,
    mealsPerDay: 3,
    activityPerWeek: 2,
    riskTier: 'MODERATE',
    alertCount: 1,
    taskCount: 4,
    hba1c: 8.5,
  },
  'non-adherent': {
    id: 'non-adherent',
    label: 'Non-Adherent',
    glucoseMean: 195,
    glucoseStdDev: 55,
    tirTarget: 0.4,
    cgmCoverage: 0.45,
    historyDays: 30,
    hasPump: true,
    mealsPerDay: 2,
    activityPerWeek: 1,
    riskTier: 'HIGH',
    alertCount: 3,
    taskCount: 3,
    hba1c: 8.8,
  },
};

export const ARCHETYPE_IDS = Object.keys(ARCHETYPES) as ArchetypeId[];
