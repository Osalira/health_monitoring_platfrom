import { NextResponse } from 'next/server';
import { prisma, ingestPayloadSchema, ingestPayload } from '@t1d/database';

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    // Validate
    const parsed = ingestPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Ingest
    const result = await ingestPayload(prisma, parsed.data);

    return NextResponse.json(result, {
      status: result.status === 'created' ? 201 : 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';

    // Patient not found
    if (message.startsWith('Patient not found')) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    console.error('[ingest] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
