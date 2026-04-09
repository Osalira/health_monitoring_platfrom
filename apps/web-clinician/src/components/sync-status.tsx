import { formatRelativeTime } from '@/lib/format';

interface SyncStatusProps {
  lastSyncAt: Date | null;
  noDataLabel?: string;
}

export function SyncStatus({ lastSyncAt, noDataLabel = '—' }: SyncStatusProps) {
  if (!lastSyncAt) {
    return <span className="text-muted-foreground">{noDataLabel}</span>;
  }

  const relative = formatRelativeTime(lastSyncAt);
  const hoursAgo = (Date.now() - lastSyncAt.getTime()) / (1000 * 60 * 60);

  const color =
    hoursAgo < 6
      ? 'text-green-600 dark:text-green-400'
      : hoursAgo < 24
        ? 'text-yellow-600 dark:text-yellow-400'
        : 'text-red-600 dark:text-red-400';

  return (
    <span className={`text-sm ${color}`}>
      <span
        className={`mr-1 inline-block h-2 w-2 rounded-full ${
          hoursAgo < 6
            ? 'bg-green-500'
            : hoursAgo < 24
              ? 'bg-yellow-500'
              : 'bg-red-500'
        }`}
        aria-hidden="true"
      />
      {relative}
    </span>
  );
}
