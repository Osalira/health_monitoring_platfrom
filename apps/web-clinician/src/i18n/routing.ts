import { defineRouting } from 'next-intl/routing';
import { supportedLocales, defaultLocale } from '@t1d/i18n';

export const routing = defineRouting({
  locales: [...supportedLocales],
  defaultLocale,
});
