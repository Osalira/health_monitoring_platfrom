import { Skeleton } from '@t1d/ui';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 pb-8">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
