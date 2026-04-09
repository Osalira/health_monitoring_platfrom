import { describe, it, expect } from 'vitest';
import {
  formatAge,
  formatRelativeTime,
  riskTierVariant,
  formatScore,
  formatHbA1c,
  formatGlucose,
  formatDate,
  priorityVariant,
  severityVariant,
} from '../format';

describe('formatAge', () => {
  it('computes age correctly', () => {
    const now = new Date();
    const tenYearsAgo = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
    expect(formatAge(tenYearsAgo)).toBe('10');
  });

  it('handles birthday not yet passed this year', () => {
    const now = new Date();
    const futureMonth = new Date(now.getFullYear() - 10, now.getMonth() + 1, now.getDate());
    expect(formatAge(futureMonth)).toBe('9');
  });
});

describe('formatRelativeTime', () => {
  const now = new Date('2026-04-09T12:00:00Z');

  it('returns "just now" for times in the future', () => {
    expect(formatRelativeTime(new Date('2026-04-09T13:00:00Z'), now)).toBe('just now');
  });

  it('returns "just now" for less than a minute', () => {
    expect(formatRelativeTime(new Date('2026-04-09T11:59:30Z'), now)).toBe('just now');
  });

  it('returns minutes for < 1 hour', () => {
    expect(formatRelativeTime(new Date('2026-04-09T11:30:00Z'), now)).toBe('30m ago');
  });

  it('returns hours for < 1 day', () => {
    expect(formatRelativeTime(new Date('2026-04-09T06:00:00Z'), now)).toBe('6h ago');
  });

  it('returns days for < 30 days', () => {
    expect(formatRelativeTime(new Date('2026-04-06T12:00:00Z'), now)).toBe('3d ago');
  });

  it('returns months for >= 30 days', () => {
    expect(formatRelativeTime(new Date('2026-02-01T12:00:00Z'), now)).toBe('2mo ago');
  });
});

describe('riskTierVariant', () => {
  it('maps CRITICAL to destructive', () => {
    expect(riskTierVariant('CRITICAL')).toBe('destructive');
  });

  it('maps HIGH to destructive', () => {
    expect(riskTierVariant('HIGH')).toBe('destructive');
  });

  it('maps MODERATE to default', () => {
    expect(riskTierVariant('MODERATE')).toBe('default');
  });

  it('maps LOW to secondary', () => {
    expect(riskTierVariant('LOW')).toBe('secondary');
  });

  it('maps unknown to outline', () => {
    expect(riskTierVariant('UNKNOWN')).toBe('outline');
  });
});

describe('formatScore', () => {
  it('rounds to integer', () => {
    expect(formatScore(72.4)).toBe('72 / 100');
  });
});

describe('formatHbA1c', () => {
  it('formats with one decimal', () => {
    expect(formatHbA1c(7.8)).toBe('7.8%');
  });

  it('returns dash for null', () => {
    expect(formatHbA1c(null)).toBe('—');
  });

  it('returns dash for undefined', () => {
    expect(formatHbA1c(undefined)).toBe('—');
  });
});

describe('formatGlucose', () => {
  it('rounds and adds unit', () => {
    expect(formatGlucose(123.7)).toBe('124 mg/dL');
  });
});

describe('formatDate', () => {
  it('formats a date', () => {
    const result = formatDate(new Date('2026-04-09'));
    expect(result).toContain('2026');
    expect(result).toContain('Apr');
  });
});

describe('priorityVariant', () => {
  it('maps URGENT to destructive', () => {
    expect(priorityVariant('URGENT')).toBe('destructive');
  });
  it('maps MEDIUM to default', () => {
    expect(priorityVariant('MEDIUM')).toBe('default');
  });
  it('maps LOW to secondary', () => {
    expect(priorityVariant('LOW')).toBe('secondary');
  });
});

describe('severityVariant', () => {
  it('maps CRITICAL to destructive', () => {
    expect(severityVariant('CRITICAL')).toBe('destructive');
  });
  it('maps WARNING to default', () => {
    expect(severityVariant('WARNING')).toBe('default');
  });
  it('maps INFO to secondary', () => {
    expect(severityVariant('INFO')).toBe('secondary');
  });
});
