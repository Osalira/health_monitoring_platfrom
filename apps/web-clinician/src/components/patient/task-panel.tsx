import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@t1d/ui';
import { formatDate, priorityVariant } from '@/lib/format';

interface TaskPanelProps {
  tasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueAt: Date | null;
  }[];
}

export function TaskPanel({ tasks }: TaskPanelProps) {
  const t = useTranslations('patientDetail');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          {t('tasksTitle')}
          {tasks.length > 0 && (
            <Badge variant="outline">{tasks.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">{t('noTasks')}</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between gap-2 border-b pb-2 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  {task.dueAt && (
                    <p className="text-xs text-muted-foreground">
                      {t('due', { date: formatDate(task.dueAt) })}
                    </p>
                  )}
                </div>
                <Badge variant={priorityVariant(task.priority)} className="shrink-0 text-xs">
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
