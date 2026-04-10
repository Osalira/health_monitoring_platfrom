import { NextResponse } from 'next/server';
import { prisma } from '@t1d/database';

const startTime = Date.now();

export async function GET() {
  let dbConnected = false;
  let dbLatencyMs: number | null = null;

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
    dbConnected = true;
  } catch {
    // DB not available
  }

  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  return NextResponse.json({
    status: dbConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    environment: process.env['NODE_ENV'] ?? 'unknown',
    uptime: `${uptimeSeconds}s`,
    database: {
      connected: dbConnected,
      latencyMs: dbLatencyMs,
    },
    auth: {
      supabaseConfigured: !!process.env['NEXT_PUBLIC_SUPABASE_URL'],
    },
  });
}
