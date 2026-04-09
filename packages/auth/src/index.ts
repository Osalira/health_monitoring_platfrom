/** Auth, session, and role helpers for T1D Command Center. */

export type { MockUser, Session } from './types';
export { DEMO_USERS, DEFAULT_USER, findUserById, getUsersByRole } from './users';
export { getSession, hasRole, hasAnyRole, requireRole, AuthorizationError } from './session';
