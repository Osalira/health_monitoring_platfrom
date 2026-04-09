import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@t1d/ui';
import { formatRelativeTime, severityVariant } from '@/lib/format';

interface AlertPanelProps {
  alerts: {
    id: string;
    type: string;
    severity: string;
    status: string;
    explanation: string | null;
    triggeredAt: Date;
  }[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const t = useTranslations('patientDetail');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          {t('alertsTitle')}
          {alerts.length > 0 && (
            <Badge variant="destructive">{alerts.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">{t('noAlerts')}</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="border-b pb-2 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={severityVariant(alert.severity)} className="text-xs">
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(alert.triggeredAt)}
                  </span>
                </div>
                {alert.explanation && (
                  <p className="mt-1 text-sm text-muted-foreground">{alert.explanation}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
