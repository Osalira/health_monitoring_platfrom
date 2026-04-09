import { NextResponse } from 'next/server';
import { prisma, type Prisma } from '@t1d/database';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { status?: string };

    if (!body.status) {
      return NextResponse.json({ error: 'status is required' }, { status: 400 });
    }

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    const data: Prisma.TaskUncheckedUpdateInput = {
      status: body.status as 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    };
    if (body.status === 'COMPLETED') data.completedAt = new Date();

    const task = await prisma.task.update({ where: { id }, data });

    return NextResponse.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[tasks] Update error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
