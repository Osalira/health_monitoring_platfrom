import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@t1d/ui';
import { formatDateTime } from '@/lib/format';

interface RecentEventsProps {
  insulin: { observedAt: Date; value: number; unit: string; subType: string | null }[];
  meals: { observedAt: Date; value: number }[];
  activity: { observedAt: Date; value: number; unit: string }[];
  labs: { observedAt: Date; value: number; unit: string; subType: string | null }[];
}

export function RecentEvents({ insulin, meals, activity, labs }: RecentEventsProps) {
  const t = useTranslations('patientDetail');

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <EventCard title={t('insulinTitle')} emptyText={t('noData')}>
        {insulin.slice(0, 10).map((e, i) => (
          <EventRow key={i} time={e.observedAt} label={e.subType ?? t('insulin')} value={`${e.value} ${e.unit}`} />
        ))}
      </EventCard>

      <EventCard title={t('mealsTitle')} emptyText={t('noData')}>
        {meals.slice(0, 10).map((e, i) => (
          <EventRow key={i} time={e.observedAt} label={t('carbs')} value={`${e.value} g`} />
        ))}
      </EventCard>

      <EventCard title={t('activityTitle')} emptyText={t('noData')}>
        {activity.slice(0, 10).map((e, i) => (
          <EventRow key={i} time={e.observedAt} label={t('activity')} value={`${e.value} ${e.unit}`} />
        ))}
      </EventCard>

      <EventCard title={t('labsTitle')} emptyText={t('noData')}>
        {labs.map((e, i) => (
          <EventRow key={i} time={e.observedAt} label={e.subType ?? t('lab')} value={`${e.value} ${e.unit}`} />
        ))}
      </EventCard>
    </div>
  );
}

function EventCard({
  title,
  emptyText,
  children,
}: {
  title: string;
  emptyText: string;
  children: React.ReactNode;
}) {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <p className="py-4 text-center text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          <div className="space-y-2 text-sm">{children}</div>
        )}
      </CardContent>
    </Card>
  );
}

function EventRow({ time, label, value }: { time: Date; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-1 last:border-0">
      <span className="text-muted-foreground">{formatDateTime(time)}</span>
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
