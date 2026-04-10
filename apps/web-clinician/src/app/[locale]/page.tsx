export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Skeleton } from '@t1d/ui';
import { getDashboardKpis, type DashboardKpis } from '@/lib/queries/dashboard';
import { getPatientRoster, type PatientRosterResult } from '@/lib/queries/patients';
import { KpiCards } from '@/components/dashboard/kpi-cards';
import { PatientRoster } from '@/components/dashboard/patient-roster';
import { RosterFilters } from '@/components/dashboard/roster-filters';
import { Pagination } from '@/components/dashboard/pagination';

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; risk?: string; page?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const filters = await searchParams;
  const page = filters.page ? parseInt(filters.page, 10) : 1;

  const [kpis, result] = await Promise.all([
    getDashboardKpis(),
    getPatientRoster({
      search: filters.search,
      riskTier: filters.risk,
      page,
    }),
  ]);

  return <DashboardContent kpis={kpis} result={result} />;
}

function DashboardContent({
  kpis,
  result,
}: {
  kpis: DashboardKpis;
  result: PatientRosterResult;
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
        <PatientRoster patients={result.rows} />
        <Suspense fallback={null}>
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
          />
        </Suspense>
      </div>
    </div>
  );
}
