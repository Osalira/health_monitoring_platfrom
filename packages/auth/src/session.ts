import type { UserRole } from '@t1d/types';
import type { Session, MockUser } from './types';
import { DEFAULT_USER, findUserById } from './users';

/**
 * Resolve the current session.
 *
 * In demo mode, this returns a mock session based on a user ID.
 * In production, this would validate a token/cookie against an auth provider.
 *
 * @param activeUserId - Optional user ID override (e.g. from cookie)
 */
export function getSession(activeUserId?: string): Session {
  const user: MockUser = activeUserId
    ? findUserById(activeUserId) ?? DEFAULT_USER
    : DEFAULT_USER;

  return {
    user,
    isAuthenticated: true,
  };
}

/**
 * Check if a session's user has a specific role.
 */
export function hasRole(session: Session, role: UserRole): boolean {
  return session.user.role === role;
}

/**
 * Check if a session's user has any of the given roles.
 */
export function hasAnyRole(session: Session, roles: UserRole[]): boolean {
  return roles.includes(session.user.role);
}

/**
 * Assert that a session has the required role.
 * Throws if the role does not match.
 *
 * Use in server components/actions to enforce access control.
 */
export function requireRole(session: Session, roles: UserRole[]): void {
  if (!hasAnyRole(session, roles)) {
    throw new AuthorizationError(
      `Role '${session.user.role}' is not authorized. Required: ${roles.join(', ')}`,
    );
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}
