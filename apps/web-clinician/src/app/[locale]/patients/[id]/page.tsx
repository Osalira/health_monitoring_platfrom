import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Button } from '@t1d/ui';
import { Link } from '@/i18n/navigation';
import { EmptyState } from '@/components/empty-state';

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PatientDetailContent />;
}

function PatientDetailContent() {
  const t = useTranslations('patientDetail');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/patients">&larr; {t('backToList')}</Link>
        </Button>
      </div>
      <EmptyState
        title={t('title')}
        description={t('title')}
      />
    </div>
  );
}
