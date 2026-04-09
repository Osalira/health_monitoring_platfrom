'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@t1d/ui';

export default function ErrorPage({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
      <p className="mt-2 text-muted-foreground">{t('description')}</p>
      <Button onClick={reset} className="mt-6">
        {t('title')}
      </Button>
    </div>
  );
}
