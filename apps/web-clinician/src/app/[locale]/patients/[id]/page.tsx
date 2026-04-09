import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { getPatientDetail } from '@/lib/queries/patient-detail';
import { PatientHeader } from '@/components/patient/patient-header';
import { GlucoseChart } from '@/components/patient/glucose-chart';
import { RecentEvents } from '@/components/patient/recent-events';
import { RiskExplanation } from '@/components/patient/risk-explanation';
import { TaskPanel } from '@/components/patient/task-panel';
import { AlertPanel } from '@/components/patient/alert-panel';
import type { PatientDetail } from '@/lib/queries/patient-detail';

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const patient = await getPatientDetail(id);
  if (!patient) notFound();

  return <PatientDetailContent patient={patient} />;
}

function PatientDetailContent({ patient }: { patient: PatientDetail }) {
  const _t = useTranslations('patientDetail');

  // Serialize glucose for the client chart component
  const glucoseData = patient.glucose.map((g) => ({
    time: g.observedAt.toISOString(),
    value: g.value,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <PatientHeader patient={patient} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main content */}
        <div className="space-y-6">
          <GlucoseChart data={glucoseData} />
          <RecentEvents
            insulin={patient.insulin}
            meals={patient.meals}
            activity={patient.activity}
            labs={patient.labs}
          />
          <RiskExplanation risk={patient.risk} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TaskPanel tasks={patient.tasks} />
          <AlertPanel alerts={patient.alerts} />
        </div>
      </div>
    </div>
  );
}
