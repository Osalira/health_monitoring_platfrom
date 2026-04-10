import { useTranslations } from 'next-intl';
import { Button, Separator, Badge } from '@t1d/ui';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import type { PatientDetail } from '@/lib/queries/patient-detail';
import { formatAge, formatDate, formatHbA1c } from '@/lib/format';
import { RiskBadge } from '@/components/risk-badge';
import { SyncStatus } from '@/components/sync-status';

interface PatientHeaderProps {
  patient: PatientDetail;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  const t = useTranslations('patientDetail');

  const cgm = patient.devices.find((d) => d.type === 'CGM');
  const latestHbA1c = patient.labs.find((l) => l.subType === 'HbA1c');

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/patients">
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t('backToList')}
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {patient.firstName} {patient.lastName}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{t('age', { value: formatAge(patient.birthDate) })}</span>
            <Separator orientation="vertical" className="h-4" />
            {patient.diagnosisDate && (
              <>
                <span>{t('diagnosed', { date: formatDate(patient.diagnosisDate) })}</span>
                <Separator orientation="vertical" className="h-4" />
              </>
            )}
            <span>{patient.primaryLanguage.toUpperCase()}</span>
            {patient.sexAtBirth && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span>{patient.sexAtBirth}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {patient.risk && <RiskBadge tier={patient.risk.tier} />}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 rounded-lg border bg-card p-4 text-sm">
        <div>
          <span className="text-muted-foreground">{t('hba1c')}</span>
          <p className="font-semibold">{formatHbA1c(latestHbA1c?.value)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">{t('riskScore')}</span>
          <p className="font-semibold">
            {patient.risk ? `${Math.round(patient.risk.score)} / 100` : '—'}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">{t('lastSync')}</span>
          <p className="font-semibold">
            <SyncStatus lastSyncAt={cgm?.lastSyncedAt?.toISOString() ?? null} />
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">{t('devices')}</span>
          <p className="font-semibold">
            {patient.devices.map((d) => `${d.manufacturer ?? ''} ${d.model ?? d.type}`).join(', ') || '—'}
          </p>
        </div>
      </div>

      {patient.consents.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{t('consent')}:</span>
          {patient.consents.map((c) => (
            <Badge
              key={c.consentType}
              variant={c.status === 'GRANTED' ? 'secondary' : c.status === 'REVOKED' ? 'destructive' : 'outline'}
              className="text-xs"
            >
              {c.consentType.replace('_', ' ')} — {c.status}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
