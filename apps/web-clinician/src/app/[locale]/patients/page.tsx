import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Skeleton } from '@t1d/ui';
import { getPatientRoster, type PatientRosterResult } from '@/lib/queries/patients';
import { PatientRoster } from '@/components/dashboard/patient-roster';
import { RosterFilters } from '@/components/dashboard/roster-filters';
import { Pagination } from '@/components/dashboard/pagination';

export default async function PatientsPage({
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

  const result = await getPatientRoster({
    search: filters.search,
    riskTier: filters.risk,
    page,
  });

  return <PatientsContent result={result} />;
}

function PatientsContent({ result }: { result: PatientRosterResult }) {
  const t = useTranslations('patients');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <div className="space-y-4">
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
