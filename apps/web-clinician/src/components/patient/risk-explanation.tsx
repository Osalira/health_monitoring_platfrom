import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@t1d/ui';
import { RiskBadge } from '@/components/risk-badge';

interface RiskExplanationProps {
  risk: {
    tier: string;
    score: number;
    factors: Record<string, number>;
    computedAt: Date;
  } | null;
}

const FACTOR_LABELS: Record<string, string> = {
  timeInRange: 'Time in Range',
  glucoseVariability: 'Glucose Variability',
  hba1c: 'HbA1c Level',
  adherence: 'Device Adherence',
  hypoglycemiaFrequency: 'Hypoglycemia Frequency',
  dataRecency: 'Data Recency',
};

export function RiskExplanation({ risk }: RiskExplanationProps) {
  const t = useTranslations('patientDetail');

  if (!risk) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('riskTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-muted-foreground">{t('noData')}</p>
        </CardContent>
      </Card>
    );
  }

  const factors = Object.entries(risk.factors).sort(([, a], [, b]) => b - a);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{t('riskTitle')}</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{Math.round(risk.score)} / 100</span>
          <RiskBadge tier={risk.tier} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {factors.map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {FACTOR_LABELS[key] ?? key}
                </span>
                <span className="font-medium">{(value * 100).toFixed(0)}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, value * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
