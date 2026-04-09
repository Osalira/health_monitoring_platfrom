import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@t1d/ui';
import { formatDate, priorityVariant } from '@/lib/format';
import { CreateTaskDialog } from './create-task-dialog';
import { TaskActions } from './task-actions';

interface TaskPanelProps {
  patientId: string;
  tasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueAt: Date | null;
    assignedTo: { displayName: string } | null;
  }[];
}

export function TaskPanel({ patientId, tasks }: TaskPanelProps) {
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
              <div key={task.id} className="border-b pb-2 last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                      {task.dueAt && (
                        <span>{t('due', { date: formatDate(task.dueAt) })}</span>
                      )}
                      {task.assignedTo && (
                        <span>· {task.assignedTo.displayName}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant={priorityVariant(task.priority)} className="shrink-0 text-xs">
                    {task.priority}
                  </Badge>
                </div>
                <TaskActions taskId={task.id} currentStatus={task.status} />
              </div>
            ))}
          </div>
        )}
        <div className="mt-3">
          <CreateTaskDialog patientId={patientId} />
        </div>
      </CardContent>
    </Card>
  );
}
