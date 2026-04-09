'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@t1d/ui';
import type { VisitPrepSummary, SummarySection as SummarySectionType, Citation } from '@t1d/summary-engine';
import { formatRelativeTime } from '@/lib/format';

interface SummarySectionProps {
  patientId: string;
  latestSummary: {
    id: string;
    kind: string;
    content: VisitPrepSummary | Record<string, unknown>;
    generatedAt: Date;
  } | null;
}

function isEnhancedSummary(content: unknown): content is VisitPrepSummary {
  return typeof content === 'object' && content !== null && 'sections' in content && 'version' in content;
}

export function SummarySection({ patientId, latestSummary }: SummarySectionProps) {
  const t = useTranslations('patientDetail.summary');
  const locale = useLocale();
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      await fetch('/api/summaries/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, locale }),
      });
      router.refresh();
    } finally {
      setGenerating(false);
    }
  }

  const enhanced = latestSummary && isEnhancedSummary(latestSummary.content)
    ? latestSummary.content
    : null;

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
        ) : !enhanced ? (
          <p className="py-4 text-center text-sm text-muted-foreground">{t('regenerateHint')}</p>
        ) : (
          <div className="space-y-5 text-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('generatedAt', { time: formatRelativeTime(latestSummary.generatedAt) })}</span>
              <Badge variant="outline">{enhanced.version}</Badge>
            </div>

            {enhanced.sections.map((section) => (
              <SectionRenderer key={section.type} section={section} />
            ))}

            <p className="border-t pt-3 text-xs text-muted-foreground">
              {t('provenanceNote')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SectionRenderer({ section }: { section: SummarySectionType }) {
  const icon = section.type === 'facts' ? '📋' : section.type === 'trends' ? '📈' : '💬';

  return (
    <div>
      <h4 className="flex items-center gap-1.5 font-medium text-foreground">
        <span aria-hidden="true">{icon}</span>
        {section.title}
      </h4>
      <ul className="mt-2 space-y-2">
        {section.items.map((item, i) => (
          <li key={i} className="text-muted-foreground">
            <span>{item.text}</span>
            {item.citations.length > 0 && (
              <span className="ml-1 inline-flex flex-wrap gap-1">
                {item.citations.map((cit, j) => (
                  <CitationTag key={j} citation={cit} />
                ))}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CitationTag({ citation }: { citation: Citation }) {
  return (
    <span
      className="inline-flex items-center rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground"
      title={`${citation.type}: ${citation.label}`}
    >
      [{citation.type}]
    </span>
  );
}
