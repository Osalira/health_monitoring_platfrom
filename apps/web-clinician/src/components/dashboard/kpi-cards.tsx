import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@t1d/ui';
import { Users, AlertTriangle, ListTodo, Bell } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { DashboardKpis } from '@/lib/queries/dashboard';

interface KpiCardsProps {
  kpis: DashboardKpis;
}

export function KpiCards({ kpis }: KpiCardsProps) {
  const t = useTranslations('dashboard.kpi');

  const cards = [
    {
      key: 'totalPatients' as const,
      value: kpis.totalPatients,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      href: '/patients',
    },
    {
      key: 'highRisk' as const,
      value: kpis.highRiskPatients,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      href: '/patients?risk=HIGH',
    },
    {
      key: 'pendingTasks' as const,
      value: kpis.openTasks,
      icon: ListTodo,
      color: 'text-orange-600 dark:text-orange-400',
      href: '/tasks',
    },
    {
      key: 'recentAlerts' as const,
      value: kpis.activeAlerts,
      icon: Bell,
      color: 'text-yellow-600 dark:text-yellow-400',
      href: '/alerts',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.key} href={card.href} className="block">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t(card.key)}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
