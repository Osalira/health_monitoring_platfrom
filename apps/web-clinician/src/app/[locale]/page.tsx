import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Skeleton } from '@t1d/ui';
import { getDashboardKpis } from '@/lib/queries/dashboard';
import { getPatientRoster } from '@/lib/queries/patients';
import { KpiCards } from '@/components/dashboard/kpi-cards';
import { PatientRoster } from '@/components/dashboard/patient-roster';
import { RosterFilters } from '@/components/dashboard/roster-filters';

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; risk?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const filters = await searchParams;
  const [kpis, patients] = await Promise.all([
    getDashboardKpis(),
    getPatientRoster({
      search: filters.search,
      riskTier: filters.risk,
    }),
  ]);

  return <DashboardContent kpis={kpis} patients={patients} />;
}

function DashboardContent({
  kpis,
  patients,
}: {
  kpis: Awaited<ReturnType<typeof getDashboardKpis>>;
  patients: Awaited<ReturnType<typeof getPatientRoster>>;
}) {
  const t = useTranslations('dashboard');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('subtitle')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <KpiCards kpis={kpis} />

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{t('roster.title')}</h2>
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <RosterFilters />
        </Suspense>
        <PatientRoster patients={patients} />
      </div>
    </div>
  );
}
