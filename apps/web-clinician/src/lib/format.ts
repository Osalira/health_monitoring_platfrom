/**
 * Formatting helpers for the clinician dashboard.
 */

/** Compute age in years from a birth date. */
export function formatAge(birthDate: Date): string {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }
  return `${age}`;
}

/** Format a date as a relative time string (e.g., "2h ago", "3d ago"). */
export function formatRelativeTime(date: Date, now = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return 'just now';

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/** Map risk tier to badge variant for display. */
export function riskTierVariant(
  tier: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (tier) {
    case 'CRITICAL':
      return 'destructive';
    case 'HIGH':
      return 'destructive';
    case 'MODERATE':
      return 'default';
    case 'LOW':
      return 'secondary';
    default:
      return 'outline';
  }
}

/** Format a risk score as "XX / 100". */
export function formatScore(score: number): string {
  return `${Math.round(score)} / 100`;
}

/** Format HbA1c value with unit. */
export function formatHbA1c(value: number | null | undefined): string {
  if (value == null) return '—';
  return `${value.toFixed(1)}%`;
}
