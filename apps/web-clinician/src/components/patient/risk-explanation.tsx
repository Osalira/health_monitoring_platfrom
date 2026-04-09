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

const FACTOR_KEYS = [
  'timeInRange',
  'glucoseVariability',
  'hba1c',
  'adherence',
  'hypoglycemiaFrequency',
  'dataRecency',
] as const;

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

  // Sort factors by contribution (highest first), only show known keys
  const factors = FACTOR_KEYS
    .filter((key) => key in risk.factors)
    .map((key) => ({ key, value: risk.factors[key] ?? 0 }))
    .sort((a, b) => b.value - a.value);

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
        <div className="space-y-4">
          {factors.map(({ key, value }) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-foreground">
                    {t(`factors.${key}`)}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {t(`factors.${key}Desc`)}
                  </p>
                </div>
                <span className="shrink-0 font-semibold">{(value * 100).toFixed(0)}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, value * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {t('riskExplainerNote')}
        </p>
      </CardContent>
    </Card>
  );
}
