import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Badge } from '@t1d/ui';
import { Link } from '@/i18n/navigation';
import { getAllActiveAlerts } from '@/lib/queries/alerts';
import { formatRelativeTime, severityVariant } from '@/lib/format';
import { EmptyState } from '@/components/empty-state';

export default async function AlertsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const alerts = await getAllActiveAlerts();

  return <AlertsContent alerts={alerts} />;
}

function AlertsContent({
  alerts,
}: {
  alerts: Awaited<ReturnType<typeof getAllActiveAlerts>>;
}) {
  const t = useTranslations('alertsPage');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {alerts.length === 0 ? (
        <EmptyState title={t('title')} description={t('empty')} />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">{t('severity')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('alert')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('patient')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('status')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('triggered')}</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id} className="border-b transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Badge variant={severityVariant(alert.severity)} className="text-xs">
                      {alert.severity}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{alert.type.replace(/_/g, ' ')}</p>
                      {alert.explanation && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{alert.explanation}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/patients/${alert.patient.id}`}
                      className="text-foreground hover:underline"
                    >
                      {alert.patient.lastName}, {alert.patient.firstName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{alert.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatRelativeTime(alert.triggeredAt)}
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
