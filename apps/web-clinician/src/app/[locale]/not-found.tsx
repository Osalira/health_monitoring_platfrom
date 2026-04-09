import { useTranslations } from 'next-intl';
import { Button } from '@t1d/ui';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('errors');

  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-foreground">
        {t('notFoundTitle')}
      </h2>
      <p className="mt-2 text-muted-foreground">{t('notFoundDescription')}</p>
      <Button asChild className="mt-6">
        <Link href="/">{t('backToDashboard')}</Link>
      </Button>
    </div>
  );
}
