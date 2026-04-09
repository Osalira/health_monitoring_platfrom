import { NextResponse } from 'next/server';
import { prisma, generateVisitPrepSummary } from '@t1d/database';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { patientId?: string; generatedByUserId?: string };

    if (!body.patientId) {
      return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    const result = await generateVisitPrepSummary(prisma, body.patientId, body.generatedByUserId);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[summaries] Generate error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
