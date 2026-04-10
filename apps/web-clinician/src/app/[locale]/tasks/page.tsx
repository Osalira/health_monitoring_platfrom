export const dynamic = 'force-dynamic';

import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Badge } from '@t1d/ui';
import { Link } from '@/i18n/navigation';
import { getAllOpenTasks } from '@/lib/queries/tasks';
import { formatDate, priorityVariant } from '@/lib/format';
import { EmptyState } from '@/components/empty-state';

export default async function TasksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tasks = await getAllOpenTasks();

  return <TasksContent tasks={tasks} />;
}

function TasksContent({
  tasks,
}: {
  tasks: Awaited<ReturnType<typeof getAllOpenTasks>>;
}) {
  const t = useTranslations('tasksPage');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title={t('title')} description={t('empty')} />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">{t('task')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('patient')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('priority')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('status')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('assignedTo')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('dueDate')}</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/patients/${task.patient.id}`}
                      className="text-foreground hover:underline"
                    >
                      {task.patient.lastName}, {task.patient.firstName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={priorityVariant(task.priority)} className="text-xs">
                      {task.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{task.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {task.assignedTo?.displayName ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {task.dueAt ? formatDate(task.dueAt) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
