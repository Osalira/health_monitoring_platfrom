import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Badge } from '@t1d/ui';
import { getRecentAuditEvents } from '@/lib/queries/audit';
import { formatDateTime } from '@/lib/format';
import { EmptyState } from '@/components/empty-state';

export default async function AuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const events = await getRecentAuditEvents(100);

  return <AuditContent events={events} />;
}

function AuditContent({
  events,
}: {
  events: Awaited<ReturnType<typeof getRecentAuditEvents>>;
}) {
  const t = useTranslations('audit');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {events.length === 0 ? (
        <EmptyState title={t('title')} description={t('empty')} />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">{t('time')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('actor')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('action')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('resource')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('patient')}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDateTime(event.occurredAt)}
                  </td>
                  <td className="px-4 py-3">
                    {event.actor?.displayName ?? <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{event.action}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{event.resourceType}</td>
                  <td className="px-4 py-3">
                    {event.patient
                      ? `${event.patient.lastName}, ${event.patient.firstName}`
                      : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
