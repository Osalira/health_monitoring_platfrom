/** Localization utilities for T1D Command Center. */

import type { Locale } from '@t1d/types';

export const defaultLocale: Locale = 'en';
export const supportedLocales: readonly Locale[] = ['en', 'fr'] as const;

export function isSupportedLocale(value: string): value is Locale {
  return (supportedLocales as readonly string[]).includes(value);
}
