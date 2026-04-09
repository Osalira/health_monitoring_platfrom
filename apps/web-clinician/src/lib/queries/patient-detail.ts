import { prisma } from '@t1d/database';

export interface PatientDetail {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  sexAtBirth: string | null;
  diagnosisDate: Date | null;
  primaryLanguage: string;

  risk: {
    tier: string;
    score: number;
    factors: Record<string, number>;
    computedAt: Date;
  } | null;

  devices: {
    type: string;
    manufacturer: string | null;
    model: string | null;
    status: string;
    lastSyncedAt: Date | null;
  }[];

  glucose: { observedAt: Date; value: number }[];
  insulin: { observedAt: Date; value: number; unit: string; subType: string | null }[];
  meals: { observedAt: Date; value: number }[];
  activity: { observedAt: Date; value: number; unit: string }[];
  labs: { observedAt: Date; value: number; unit: string; subType: string | null }[];

  tasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueAt: Date | null;
    assignedTo: { displayName: string } | null;
  }[];

  outreachLogs: {
    id: string;
    type: string;
    note: string;
    contactedAt: Date;
    author: { displayName: string } | null;
  }[];

  alerts: {
    id: string;
    type: string;
    severity: string;
    status: string;
    explanation: string | null;
    triggeredAt: Date;
  }[];

  latestSummary: {
    id: string;
    kind: string;
    content: Record<string, unknown>;
    generatedAt: Date;
  } | null;
}

export async function getPatientDetail(
  id: string,
  days = 14,
): Promise<PatientDetail | null> {
  const windowStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      riskAssessments: {
        orderBy: { computedAt: 'desc' },
        take: 1,
      },
      devices: {
        select: {
          type: true,
          manufacturer: true,
          model: true,
          status: true,
          lastSyncedAt: true,
        },
      },
      tasks: {
        where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
        orderBy: { priority: 'desc' },
        select: {
          id: true, title: true, status: true, priority: true, dueAt: true,
          assignedTo: { select: { displayName: true } },
        },
      },
      outreachLogs: {
        orderBy: { contactedAt: 'desc' },
        take: 10,
        select: {
          id: true, type: true, note: true, contactedAt: true,
          author: { select: { displayName: true } },
        },
      },
      alerts: {
        where: { status: { in: ['ACTIVE', 'ACKNOWLEDGED'] } },
        orderBy: { severity: 'desc' },
        select: {
          id: true,
          type: true,
          severity: true,
          status: true,
          explanation: true,
          triggeredAt: true,
        },
      },
    },
  });

  if (!patient) return null;

  // Fetch observations and latest summary in parallel
  const [glucose, insulin, meals, activity, labs, latestSummaryRecord] = await Promise.all([
    prisma.observation.findMany({
      where: { patientId: id, type: 'GLUCOSE', observedAt: { gte: windowStart } },
      orderBy: { observedAt: 'asc' },
      select: { observedAt: true, value: true },
    }),
    prisma.observation.findMany({
      where: { patientId: id, type: 'INSULIN', observedAt: { gte: windowStart } },
      orderBy: { observedAt: 'desc' },
      select: { observedAt: true, value: true, unit: true, subType: true },
    }),
    prisma.observation.findMany({
      where: { patientId: id, type: 'CARBS', observedAt: { gte: windowStart } },
      orderBy: { observedAt: 'desc' },
      select: { observedAt: true, value: true },
    }),
    prisma.observation.findMany({
      where: { patientId: id, type: 'ACTIVITY', observedAt: { gte: windowStart } },
      orderBy: { observedAt: 'desc' },
      select: { observedAt: true, value: true, unit: true },
    }),
    prisma.observation.findMany({
      where: { patientId: id, type: 'LAB' },
      orderBy: { observedAt: 'desc' },
      select: { observedAt: true, value: true, unit: true, subType: true },
    }),
    prisma.generatedSummary.findFirst({
      where: { patientId: id },
      orderBy: { generatedAt: 'desc' },
      select: { id: true, kind: true, content: true, generatedAt: true },
    }),
  ]);

  const ra = patient.riskAssessments[0];

  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    birthDate: patient.birthDate,
    sexAtBirth: patient.sexAtBirth,
    diagnosisDate: patient.diagnosisDate,
    primaryLanguage: patient.primaryLanguage,
    risk: ra
      ? {
          tier: ra.tier,
          score: ra.score,
          factors: ra.factors as Record<string, number>,
          computedAt: ra.computedAt,
        }
      : null,
    devices: patient.devices,
    glucose,
    insulin,
    meals,
    activity,
    labs,
    tasks: patient.tasks,
    alerts: patient.alerts,
    outreachLogs: patient.outreachLogs,
    latestSummary: latestSummaryRecord
      ? {
          id: latestSummaryRecord.id,
          kind: latestSummaryRecord.kind,
          content: latestSummaryRecord.content as Record<string, unknown>,
          generatedAt: latestSummaryRecord.generatedAt,
        }
      : null,
  };
}
