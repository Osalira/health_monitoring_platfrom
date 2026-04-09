import { prisma } from '@t1d/database';

export interface PatientRosterRow {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  riskTier: string | null;
  riskScore: number | null;
  latestHbA1c: number | null;
  lastSyncAt: Date | null;
  openTaskCount: number;
  activeAlertCount: number;
}

export interface PatientRosterFilters {
  search?: string | undefined;
  riskTier?: string | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}

export interface PatientRosterResult {
  rows: PatientRosterRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 15;

export async function getPatientRoster(
  filters: PatientRosterFilters = {},
): Promise<PatientRosterResult> {
  const { search, riskTier } = filters;
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;

  // Build the where clause for patients
  const searchWhere = search
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  // If risk tier filter is set, we need patients whose latest risk matches
  // We'll filter in-app after joining, since Prisma can't filter on nested take-1 easily
  const patients = await prisma.patient.findMany({
    where: searchWhere,
    include: {
      riskAssessments: {
        orderBy: { computedAt: 'desc' },
        take: 1,
        select: { tier: true, score: true },
      },
      devices: {
        where: { type: 'CGM' },
        orderBy: { lastSyncedAt: 'desc' },
        take: 1,
        select: { lastSyncedAt: true },
      },
      observations: {
        where: {
          type: 'LAB',
          subType: 'HbA1c',
        },
        orderBy: { observedAt: 'desc' },
        take: 1,
        select: { value: true },
      },
      _count: {
        select: {
          tasks: { where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } },
          alerts: { where: { status: 'ACTIVE' } },
        },
      },
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  let rows: PatientRosterRow[] = patients.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    birthDate: p.birthDate,
    riskTier: p.riskAssessments[0]?.tier ?? null,
    riskScore: p.riskAssessments[0]?.score ?? null,
    latestHbA1c: p.observations[0]?.value ?? null,
    lastSyncAt: p.devices[0]?.lastSyncedAt ?? null,
    openTaskCount: p._count.tasks,
    activeAlertCount: p._count.alerts,
  }));

  // Filter by risk tier if specified
  if (riskTier && riskTier !== 'ALL') {
    rows = rows.filter((r) => r.riskTier === riskTier);
  }

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * pageSize;

  return {
    rows: rows.slice(start, start + pageSize),
    total,
    page: clampedPage,
    pageSize,
    totalPages,
  };
}
