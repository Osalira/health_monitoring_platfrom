'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@t1d/ui';
import type { SummaryContent } from '@t1d/database';
import { formatRelativeTime, formatHbA1c } from '@/lib/format';
import { RiskBadge } from '@/components/risk-badge';

interface SummarySectionProps {
  patientId: string;
  latestSummary: {
    id: string;
    kind: string;
    content: SummaryContent;
    generatedAt: Date;
  } | null;
}

export function SummarySection({ patientId, latestSummary }: SummarySectionProps) {
  const t = useTranslations('patientDetail.summary');
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      await fetch('/api/summaries/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId }),
      });
      router.refresh();
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          {t('title')}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? t('generating') : t('generate')}
        </Button>
      </CardHeader>
      <CardContent>
        {!latestSummary ? (
          <p className="py-4 text-center text-sm text-muted-foreground">{t('noSummary')}</p>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('generatedAt', { time: formatRelativeTime(latestSummary.generatedAt) })}</span>
              <Badge variant="outline">{latestSummary.kind}</Badge>
            </div>

            {latestSummary.content.riskSummary && (
              <div>
                <h4 className="font-medium">{t('riskSection')}</h4>
                <div className="mt-1 flex items-center gap-2">
                  <RiskBadge tier={latestSummary.content.riskSummary.tier} />
                  <span>{latestSummary.content.riskSummary.score} / 100</span>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium">{t('metricsSection')}</h4>
              <div className="mt-1 grid grid-cols-2 gap-2 text-muted-foreground">
                <span>{t('avgGlucose')}: {latestSummary.content.recentMetrics.avgGlucose ?? '—'} mg/dL</span>
                <span>{t('tir')}: {latestSummary.content.recentMetrics.timeInRange != null ? `${Math.round(latestSummary.content.recentMetrics.timeInRange * 100)}%` : '—'}</span>
                <span>HbA1c: {formatHbA1c(latestSummary.content.recentMetrics.latestHbA1c)}</span>
                <span>{t('adherence')}: {latestSummary.content.recentMetrics.readingAdherence != null ? `${Math.round(latestSummary.content.recentMetrics.readingAdherence * 100)}%` : '—'}</span>
              </div>
            </div>

            {latestSummary.content.openItems.taskCount > 0 && (
              <div>
                <h4 className="font-medium">{t('openItems')}</h4>
                <ul className="mt-1 list-inside list-disc text-muted-foreground">
                  {latestSummary.content.openItems.topTasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
