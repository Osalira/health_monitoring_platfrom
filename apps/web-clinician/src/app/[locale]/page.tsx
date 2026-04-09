import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@t1d/ui';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardContent />;
}

function DashboardContent() {
  const t = useTranslations('dashboard');

  const kpis = [
    { key: 'totalPatients' as const, value: '—' },
    { key: 'highRisk' as const, value: '—' },
    { key: 'pendingTasks' as const, value: '—' },
    { key: 'recentAlerts' as const, value: '—' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('subtitle')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(`kpi.${kpi.key}`)}
              </CardTitle>
              <Badge variant="secondary">{kpi.value}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
