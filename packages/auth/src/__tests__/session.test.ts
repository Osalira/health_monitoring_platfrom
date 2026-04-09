import { describe, it, expect } from 'vitest';
import {
  getSession,
  hasRole,
  hasAnyRole,
  requireRole,
  AuthorizationError,
  DEMO_USERS,
  DEFAULT_USER,
  findUserById,
  getUsersByRole,
} from '../index';

describe('demo users', () => {
  it('has one user per role', () => {
    const roles = DEMO_USERS.map((u) => u.role);
    expect(new Set(roles).size).toBe(DEMO_USERS.length);
  });

  it('default user is a clinician', () => {
    expect(DEFAULT_USER.role).toBe('clinician');
  });

  it('findUserById returns correct user', () => {
    const user = findUserById('usr_clinician_01');
    expect(user?.displayName).toBe('Dr. Sarah Chen');
  });

  it('findUserById returns undefined for unknown ID', () => {
    expect(findUserById('nonexistent')).toBeUndefined();
  });

  it('getUsersByRole filters correctly', () => {
    const educators = getUsersByRole('educator');
    expect(educators).toHaveLength(1);
    expect(educators[0]?.role).toBe('educator');
  });
});

describe('getSession', () => {
  it('returns default clinician session without user ID', () => {
    const session = getSession();
    expect(session.isAuthenticated).toBe(true);
    expect(session.user.role).toBe('clinician');
    expect(session.user.displayName).toBe('Dr. Sarah Chen');
  });

  it('returns specific user session when given valid ID', () => {
    const session = getSession('usr_educator_01');
    expect(session.user.role).toBe('educator');
    expect(session.user.displayName).toBe('Marc Dupont');
  });

  it('falls back to default user for unknown ID', () => {
    const session = getSession('nonexistent');
    expect(session.user.role).toBe('clinician');
  });
});

describe('hasRole', () => {
  it('returns true when role matches', () => {
    const session = getSession();
    expect(hasRole(session, 'clinician')).toBe(true);
  });

  it('returns false when role does not match', () => {
    const session = getSession();
    expect(hasRole(session, 'patient')).toBe(false);
  });
});

describe('hasAnyRole', () => {
  it('returns true when user role is in the list', () => {
    const session = getSession();
    expect(hasAnyRole(session, ['clinician', 'admin'])).toBe(true);
  });

  it('returns false when user role is not in the list', () => {
    const session = getSession();
    expect(hasAnyRole(session, ['patient', 'caregiver'])).toBe(false);
  });
});

describe('requireRole', () => {
  it('does not throw when role matches', () => {
    const session = getSession();
    expect(() => requireRole(session, ['clinician', 'admin'])).not.toThrow();
  });

  it('throws AuthorizationError when role does not match', () => {
    const session = getSession();
    expect(() => requireRole(session, ['patient'])).toThrow(AuthorizationError);
  });

  it('error message includes actual and required roles', () => {
    const session = getSession();
    try {
      requireRole(session, ['patient', 'caregiver']);
    } catch (e) {
      expect(e).toBeInstanceOf(AuthorizationError);
      expect((e as AuthorizationError).message).toContain('clinician');
      expect((e as AuthorizationError).message).toContain('patient');
    }
  });
});
