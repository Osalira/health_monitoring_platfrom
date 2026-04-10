import { prisma } from '@t1d/database';

export interface TaskListRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueAt: Date | null;
  createdAt: Date;
  patient: { id: string; firstName: string; lastName: string };
  assignedTo: { displayName: string } | null;
}

export async function getAllOpenTasks(): Promise<TaskListRow[]> {
  return prisma.task.findMany({
    where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
    orderBy: [{ priority: 'desc' }, { dueAt: 'asc' }],
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueAt: true,
      createdAt: true,
      patient: { select: { id: true, firstName: true, lastName: true } },
      assignedTo: { select: { displayName: true } },
    },
  });
}
