/**
 * Bilingual template strings for visit-prep summary generation.
 *
 * Each template is a function that accepts data values and returns localized text.
 * No clinical recommendations — only facts, observations, and discussion prompts.
 */

import type { SummaryLocale } from './types';

type T = Record<SummaryLocale, string>;

// Section titles
export const sectionTitles: Record<string, T> = {
  facts: { en: 'Current Status', fr: 'État actuel' },
  trends: { en: 'Recent Trends', fr: 'Tendances récentes' },
  discussion: { en: 'Suggested Discussion Points', fr: 'Points de discussion suggérés' },
};

// Fact templates
export const factTemplates = {
  riskTier: (tier: string, score: number, locale: SummaryLocale): string =>
    locale === 'en'
      ? `Current risk tier is ${tier} (score: ${score}/100).`
      : `Le niveau de risque actuel est ${tier} (score : ${score}/100).`,

  hba1c: (value: number, locale: SummaryLocale): string =>
    locale === 'en'
      ? `Latest HbA1c is ${value.toFixed(1)}%.`
      : `Le dernier HbA1c est de ${value.toFixed(1)} %.`,

  avgGlucose: (value: number, locale: SummaryLocale): string =>
    locale === 'en'
      ? `Average glucose over the past 7 days is ${Math.round(value)} mg/dL.`
      : `La glycémie moyenne des 7 derniers jours est de ${Math.round(value)} mg/dL.`,

  timeInRange: (value: number, locale: SummaryLocale): string =>
    locale === 'en'
      ? `Time in range (70–180 mg/dL) is ${Math.round(value * 100)}%.`
      : `Le temps dans la cible (70–180 mg/dL) est de ${Math.round(value * 100)} %.`,

  adherence: (value: number, locale: SummaryLocale): string =>
    locale === 'en'
      ? `CGM reading adherence is ${Math.round(value * 100)}%.`
      : `L'observance du capteur est de ${Math.round(value * 100)} %.`,

  deviceSync: (type: string, hoursAgo: number, locale: SummaryLocale): string =>
    locale === 'en'
      ? `${type} last synced ${Math.round(hoursAgo)} hours ago.`
      : `Le ${type} a été synchronisé il y a ${Math.round(hoursAgo)} heures.`,

  alertCount: (count: number, locale: SummaryLocale): string =>
    locale === 'en'
      ? `${count} active alert${count !== 1 ? 's' : ''} requiring attention.`
      : `${count} alerte${count !== 1 ? 's' : ''} active${count !== 1 ? 's' : ''} nécessitant attention.`,

  taskCount: (count: number, locale: SummaryLocale): string =>
    locale === 'en'
      ? `${count} open task${count !== 1 ? 's' : ''}.`
      : `${count} tâche${count !== 1 ? 's' : ''} ouverte${count !== 1 ? 's' : ''}.`,
};

// Trend templates
export const trendTemplates = {
  glucoseChange: (current: number, previous: number, locale: SummaryLocale): string => {
    const diff = Math.round(current - previous);
    const direction = diff > 0
      ? (locale === 'en' ? 'increased' : 'augmenté')
      : (locale === 'en' ? 'decreased' : 'diminué');
    return locale === 'en'
      ? `Average glucose ${direction} by ${Math.abs(diff)} mg/dL over the past 7 days.`
      : `La glycémie moyenne a ${direction} de ${Math.abs(diff)} mg/dL au cours des 7 derniers jours.`;
  },

  tirChange: (current: number, previous: number, locale: SummaryLocale): string => {
    const diff = Math.round((current - previous) * 100);
    const direction = diff > 0
      ? (locale === 'en' ? 'improved' : 'amélioré')
      : (locale === 'en' ? 'declined' : 'diminué');
    return locale === 'en'
      ? `Time in range ${direction} by ${Math.abs(diff)} percentage points.`
      : `Le temps dans la cible a ${direction} de ${Math.abs(diff)} points de pourcentage.`;
  },
};

// Discussion templates
export const discussionTemplates = {
  lowTIR: (locale: SummaryLocale): string =>
    locale === 'en'
      ? 'Time in range is below 70% — consider reviewing insulin dosing and meal patterns.'
      : 'Le temps dans la cible est inférieur à 70 % — envisager une revue du dosage d\'insuline et des habitudes alimentaires.',

  highRisk: (locale: SummaryLocale): string =>
    locale === 'en'
      ? 'Risk tier is HIGH or CRITICAL — prioritize this patient for follow-up.'
      : 'Le niveau de risque est ÉLEVÉ ou CRITIQUE — prioriser ce patient pour un suivi.',

  lowAdherence: (locale: SummaryLocale): string =>
    locale === 'en'
      ? 'CGM adherence is below 80% — discuss device wear habits and barriers.'
      : 'L\'observance du capteur est inférieure à 80 % — discuter des habitudes de port et des obstacles.',

  deviceDisconnected: (locale: SummaryLocale): string =>
    locale === 'en'
      ? 'A device has not synced recently — verify connectivity and troubleshoot.'
      : 'Un appareil n\'a pas été synchronisé récemment — vérifier la connectivité.',

  openAlerts: (locale: SummaryLocale): string =>
    locale === 'en'
      ? 'Review active alerts before the visit.'
      : 'Examiner les alertes actives avant la visite.',

  pendingTasks: (locale: SummaryLocale): string =>
    locale === 'en'
      ? 'Review and prioritize open tasks.'
      : 'Examiner et prioriser les tâches ouvertes.',
};
