import { NextResponse } from 'next/server';
import { prisma } from '@t1d/database';

export async function GET() {
  const users = await prisma.user.findMany({
    where: { role: { in: ['CLINICIAN', 'EDUCATOR'] } },
    select: { id: true, displayName: true, role: true },
    orderBy: { displayName: 'asc' },
  });
  return NextResponse.json(users);
}
