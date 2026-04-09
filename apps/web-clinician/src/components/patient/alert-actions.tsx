'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@t1d/ui';

interface AlertActionsProps {
  alertId: string;
  currentStatus: string;
}

export function AlertActions({ alertId, currentStatus }: AlertActionsProps) {
  const t = useTranslations('patientDetail.alertActions');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (currentStatus === 'RESOLVED' || currentStatus === 'DISMISSED') return null;

  return (
    <div className="mt-1 flex gap-1">
      {currentStatus === 'ACTIVE' && (
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => updateStatus('ACKNOWLEDGED')}
          disabled={loading}
        >
          {t('acknowledge')}
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={() => updateStatus('RESOLVED')}
        disabled={loading}
      >
        {t('resolve')}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={() => updateStatus('DISMISSED')}
        disabled={loading}
      >
        {t('dismiss')}
      </Button>
    </div>
  );
}
