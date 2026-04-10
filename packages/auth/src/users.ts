import type { MockUser } from './types';

/**
 * Predefined demo users — one per role.
 * In production, this would come from a real auth provider.
 */
export const DEMO_USERS: readonly MockUser[] = [
  {
    id: 'usr_clinician_01',
    email: 'clinician@t1d-demo.app',
    displayName: 'Dr. Sarah Chen',
    role: 'clinician',
    localePreference: 'en',
    themePreference: 'light',
  },
  {
    id: 'usr_educator_01',
    email: 'educator@t1d-demo.app',
    displayName: 'Marc Dupont',
    role: 'educator',
    localePreference: 'fr',
    themePreference: 'light',
  },
  {
    id: 'usr_admin_01',
    email: 'admin@t1d-demo.app',
    displayName: 'Clinic Admin',
    role: 'admin',
    localePreference: 'en',
    themePreference: 'dark',
  },
  {
    id: 'usr_patient_01',
    email: 'alex.martin@example.com',
    displayName: 'Alex Martin',
    role: 'patient',
    localePreference: 'en',
    themePreference: 'light',
  },
  {
    id: 'usr_caregiver_01',
    email: 'julie.martin@example.com',
    displayName: 'Julie Martin',
    role: 'caregiver',
    localePreference: 'fr',
    themePreference: 'light',
  },
] as const;

// Safe assertion: array is a const literal with known length
export const DEFAULT_USER: MockUser = DEMO_USERS[0]!; // Dr. Sarah Chen (clinician)

export function findUserById(id: string): MockUser | undefined {
  return DEMO_USERS.find((u) => u.id === id);
}

export function getUsersByRole(role: MockUser['role']): MockUser[] {
  return DEMO_USERS.filter((u) => u.role === role);
}
