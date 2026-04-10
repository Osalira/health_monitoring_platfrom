import { NextResponse } from 'next/server';
import { prisma, type Prisma, createAuditEvent } from '@t1d/database';
import { getActorFromRequest } from '@/lib/get-actor';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      patientId?: string;
      type?: string;
      note?: string;
      authorId?: string;
    };

    if (!body.patientId || !body.type || !body.note) {
      return NextResponse.json(
        { error: 'patientId, type, and note are required' },
        { status: 400 },
      );
    }

    const data: Prisma.OutreachLogUncheckedCreateInput = {
      patientId: body.patientId,
      type: body.type,
      note: body.note,
    };
    if (body.authorId) data.authorId = body.authorId;

    const entry = await prisma.outreachLog.create({ data });

    await createAuditEvent(prisma, {
      action: 'CREATE',
      resourceType: 'outreach',
      resourceId: entry.id,
      patientId: body.patientId,
      actorUserId: body.authorId ?? await getActorFromRequest(request),
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[outreach] Create error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
