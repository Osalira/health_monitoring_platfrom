'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@t1d/ui';

interface TaskActionsProps {
  taskId: string;
  currentStatus: string;
}

export function TaskActions({ taskId, currentStatus }: TaskActionsProps) {
  const t = useTranslations('patientDetail.taskActions');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') return null;

  return (
    <div className="mt-1 flex gap-1">
      {currentStatus === 'OPEN' && (
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => updateStatus('IN_PROGRESS')}
          disabled={loading}
        >
          {t('start')}
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={() => updateStatus('COMPLETED')}
        disabled={loading}
      >
        {t('complete')}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={() => updateStatus('CANCELLED')}
        disabled={loading}
      >
        {t('cancel')}
      </Button>
    </div>
  );
}
