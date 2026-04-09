import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { getPatientDetail } from '@/lib/queries/patient-detail';
import { PatientHeader } from '@/components/patient/patient-header';
import { GlucoseChart } from '@/components/patient/glucose-chart';
import { TimeRangeSelector } from '@/components/patient/time-range-selector';
import { RecentEvents } from '@/components/patient/recent-events';
import { RiskExplanation } from '@/components/patient/risk-explanation';
import { TaskPanel } from '@/components/patient/task-panel';
import { AlertPanel } from '@/components/patient/alert-panel';
import { SummarySection } from '@/components/patient/summary-section';
import { OutreachPanel } from '@/components/patient/outreach-panel';
import type { PatientDetail } from '@/lib/queries/patient-detail';
import type { SummaryContent } from '@t1d/database';

export default async function PatientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ days?: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const filters = await searchParams;
  const days = filters.days ? parseInt(filters.days, 10) : 14;
  const safeDays = [7, 14, 30].includes(days) ? days : 14;

  const patient = await getPatientDetail(id, safeDays);
  if (!patient) notFound();

  return <PatientDetailContent patient={patient} days={safeDays} />;
}

function PatientDetailContent({ patient, days }: { patient: PatientDetail; days: number }) {
  const t = useTranslations('patientDetail');

  const glucoseData = patient.glucose.map((g) => ({
    time: g.observedAt.toISOString(),
    value: g.value,
  }));

  const summaryForComponent = patient.latestSummary
    ? {
        ...patient.latestSummary,
        content: patient.latestSummary.content as unknown as SummaryContent,
      }
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <PatientHeader patient={patient} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {t('glucoseTitle')} — {t(`range.${days}d`)}
            </h2>
            <Suspense fallback={null}>
              <TimeRangeSelector />
            </Suspense>
          </div>
          <GlucoseChart data={glucoseData} />
          <RecentEvents
            insulin={patient.insulin}
            meals={patient.meals}
            activity={patient.activity}
            labs={patient.labs}
          />
          <RiskExplanation risk={patient.risk} />
          <SummarySection
            patientId={patient.id}
            latestSummary={summaryForComponent}
          />
        </div>

        <div className="space-y-6">
          <TaskPanel patientId={patient.id} tasks={patient.tasks} />
          <AlertPanel alerts={patient.alerts} />
          <OutreachPanel patientId={patient.id} logs={patient.outreachLogs} />
        </div>
      </div>
    </div>
  );
}
