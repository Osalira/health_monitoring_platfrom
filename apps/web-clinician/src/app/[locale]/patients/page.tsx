import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { EmptyState } from '@/components/empty-state';

export default async function PatientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PatientsContent />;
}

function PatientsContent() {
  const t = useTranslations('patients');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <EmptyState title={t('title')} description={t('empty')} />
    </div>
  );
}
