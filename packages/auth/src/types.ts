import type { UserRole, Locale, Theme } from '@t1d/types';

export interface MockUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  localePreference: Locale;
  themePreference: Theme;
}

export interface Session {
  user: MockUser;
  isAuthenticated: boolean;
}
