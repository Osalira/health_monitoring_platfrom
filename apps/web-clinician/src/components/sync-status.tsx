'use client';

import { useState, useEffect } from 'react';
import { formatRelativeTime } from '@/lib/format';

interface SyncStatusProps {
  lastSyncAt: string | null;
  noDataLabel?: string;
}

const REFRESH_INTERVAL_MS = 60_000; // Update every minute

export function SyncStatus({ lastSyncAt, noDataLabel = '—' }: SyncStatusProps) {
  const [, setTick] = useState(0);

  // Re-render every minute to keep relative times fresh
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (!lastSyncAt) {
    return <span className="text-muted-foreground">{noDataLabel}</span>;
  }

  const date = new Date(lastSyncAt);
  const relative = formatRelativeTime(date);
  const hoursAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60);

  const color =
    hoursAgo < 6
      ? 'text-green-600 dark:text-green-400'
      : hoursAgo < 24
        ? 'text-yellow-600 dark:text-yellow-400'
        : 'text-red-600 dark:text-red-400';

  const dotColor =
    hoursAgo < 6
      ? 'bg-green-500'
      : hoursAgo < 24
        ? 'bg-yellow-500'
        : 'bg-red-500';

  return (
    <span className={`text-sm ${color}`}>
      <span
        className={`mr-1 inline-block h-2 w-2 rounded-full ${dotColor}`}
        aria-hidden="true"
      />
      {relative}
    </span>
  );
}
