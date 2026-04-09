import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { PatientRosterRow } from '@/lib/queries/patients';
import { formatAge, formatHbA1c, formatScore } from '@/lib/format';
import { RiskBadge } from '@/components/risk-badge';
import { SyncStatus } from '@/components/sync-status';
import { Badge } from '@t1d/ui';
import { EmptyState } from '@/components/empty-state';

interface PatientRosterProps {
  patients: PatientRosterRow[];
}

export function PatientRoster({ patients }: PatientRosterProps) {
  const t = useTranslations('dashboard.roster');
  const tEmpty = useTranslations('patients');

  if (patients.length === 0) {
    return <EmptyState title={tEmpty('title')} description={tEmpty('empty')} />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">{t('name')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('age')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('risk')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('score')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('hba1c')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('lastSync')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('tasks')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('alerts')}</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="border-b transition-colors hover:bg-muted/30"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/patients/${patient.id}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {patient.lastName}, {patient.firstName}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatAge(patient.birthDate)}
              </td>
              <td className="px-4 py-3">
                <RiskBadge tier={patient.riskTier} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {patient.riskScore != null ? formatScore(patient.riskScore) : '—'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatHbA1c(patient.latestHbA1c)}
              </td>
              <td className="px-4 py-3">
                <SyncStatus lastSyncAt={patient.lastSyncAt} />
              </td>
              <td className="px-4 py-3">
                {patient.openTaskCount > 0 ? (
                  <Badge variant="outline">{patient.openTaskCount}</Badge>
                ) : (
                  <span className="text-muted-foreground">0</span>
                )}
              </td>
              <td className="px-4 py-3">
                {patient.activeAlertCount > 0 ? (
                  <Badge variant="destructive">{patient.activeAlertCount}</Badge>
                ) : (
                  <span className="text-muted-foreground">0</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
