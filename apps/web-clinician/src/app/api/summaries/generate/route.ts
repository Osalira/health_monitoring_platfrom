import { NextResponse } from 'next/server';
import { prisma, generateVisitPrepSummary, createAuditEvent } from '@t1d/database';
import type { SummaryLocale } from '@t1d/summary-engine';
import { getActorFromRequest } from '@/lib/get-actor';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      patientId?: string;
      generatedByUserId?: string;
      locale?: string;
    };

    if (!body.patientId) {
      return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    const locale: SummaryLocale = body.locale === 'fr' ? 'fr' : 'en';

    const result = await generateVisitPrepSummary(
      prisma,
      body.patientId,
      body.generatedByUserId,
      locale,
    );

    await createAuditEvent(prisma, {
      action: 'GENERATE',
      resourceType: 'summary',
      resourceId: result.id,
      patientId: body.patientId,
      actorUserId: body.generatedByUserId ?? await getActorFromRequest(request),
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[summaries] Generate error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
