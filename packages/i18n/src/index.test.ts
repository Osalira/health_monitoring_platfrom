import { describe, it, expect } from 'vitest';
import { defaultLocale, supportedLocales, isSupportedLocale } from './index';

describe('i18n utilities', () => {
  it('defaults to English', () => {
    expect(defaultLocale).toBe('en');
  });

  it('supports English and French', () => {
    expect(supportedLocales).toContain('en');
    expect(supportedLocales).toContain('fr');
    expect(supportedLocales).toHaveLength(2);
  });

  it('validates supported locales', () => {
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('fr')).toBe(true);
    expect(isSupportedLocale('de')).toBe(false);
    expect(isSupportedLocale('')).toBe(false);
  });
});
