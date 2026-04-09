import { NextResponse } from 'next/server';
import { prisma, computePatientMetrics } from '@t1d/database';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { patientId?: string; days?: number };

    if (!body.patientId) {
      return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: body.patientId },
      select: { id: true },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const result = await computePatientMetrics(prisma, body.patientId, body.days ?? 30);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[compute-metrics] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
