import { NextResponse } from 'next/server';
import { prisma, type Prisma, createAuditEvent } from '@t1d/database';
import { getActorFromRequest } from '@/lib/get-actor';

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

    const validStatuses = ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    const data: Prisma.AlertUncheckedUpdateInput = {
      status: body.status as 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED',
    };
    if (body.status === 'ACKNOWLEDGED') data.acknowledgedAt = new Date();

    const alert = await prisma.alert.update({ where: { id }, data });

    await createAuditEvent(prisma, {
      action: 'UPDATE',
      resourceType: 'alert',
      resourceId: id,
      patientId: alert.patientId,
      actorUserId: await getActorFromRequest(request),
      metadata: { newStatus: body.status },
    });

    return NextResponse.json(alert);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[alerts] Update error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
