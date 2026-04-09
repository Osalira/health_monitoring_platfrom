'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@t1d/ui';

const RANGES = [7, 14, 30] as const;

export function TimeRangeSelector() {
  const t = useTranslations('patientDetail.range');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentDays = parseInt(searchParams.get('days') ?? '14', 10);

  function selectRange(days: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (days === 14) {
      params.delete('days');
    } else {
      params.set('days', String(days));
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }

  return (
    <div className="flex gap-1">
      {RANGES.map((days) => (
        <Button
          key={days}
          variant={currentDays === days ? 'default' : 'outline'}
          size="sm"
          onClick={() => selectRange(days)}
          disabled={isPending}
        >
          {t(`${days}d`)}
        </Button>
      ))}
    </div>
  );
}
