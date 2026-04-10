import { NextResponse } from 'next/server';
import { prisma, type Prisma, createAuditEvent } from '@t1d/database';
import { getActorFromRequest } from '@/lib/get-actor';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      patientId?: string;
      title?: string;
      description?: string;
      priority?: string;
      assignedToUserId?: string;
      dueAt?: string;
    };

    if (!body.patientId || !body.title) {
      return NextResponse.json(
        { error: 'patientId and title are required' },
        { status: 400 },
      );
    }

    const data: Prisma.TaskUncheckedCreateInput = {
      patientId: body.patientId,
      title: body.title,
      priority: (body.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') ?? 'MEDIUM',
      status: 'OPEN',
    };
    if (body.description) data.description = body.description;
    if (body.assignedToUserId) data.assignedToUserId = body.assignedToUserId;
    if (body.dueAt) data.dueAt = new Date(body.dueAt);

    const task = await prisma.task.create({ data });

    await createAuditEvent(prisma, {
      action: 'CREATE',
      resourceType: 'task',
      resourceId: task.id,
      patientId: body.patientId,
      actorUserId: await getActorFromRequest(request),
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[tasks] Create error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
