/**
 * Database seed script.
 *
 * Creates demo users, then generates 30 synthetic patients (6 per archetype)
 * with full clinical data using the @t1d/synthetic-data pipeline.
 *
 * Usage: pnpm --filter @t1d/database db:seed
 */

import { PrismaClient } from '../generated/prisma';
import { generateAllStories, type PatientStory } from '@t1d/synthetic-data';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('Creating demo users...');

  const clinician = await prisma.user.upsert({
    where: { email: 'clinician@t1d-demo.app' },
    update: {},
    create: {
      id: 'usr_clinician_01',
      email: 'clinician@t1d-demo.app',
      displayName: 'Dr. Sarah Chen',
      role: 'CLINICIAN',
      localePreference: 'en',
      themePreference: 'light',
    },
  });

  const educator = await prisma.user.upsert({
    where: { email: 'educator@t1d-demo.app' },
    update: {},
    create: {
      id: 'usr_educator_01',
      email: 'educator@t1d-demo.app',
      displayName: 'Marc Dupont',
      role: 'EDUCATOR',
      localePreference: 'fr',
      themePreference: 'light',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@t1d-demo.app' },
    update: {},
    create: {
      id: 'usr_admin_01',
      email: 'admin@t1d-demo.app',
      displayName: 'Clinic Admin',
      role: 'ADMIN',
      localePreference: 'en',
      themePreference: 'dark',
    },
  });

  return { clinician, educator };
}

async function seedStory(
  story: PatientStory,
  clinicianId: string,
  educatorId: string,
  index: number,
) {
  // Create patient
  const patient = await prisma.patient.upsert({
    where: { externalRef: story.patient.externalRef },
    update: {},
    create: {
      externalRef: story.patient.externalRef,
      firstName: story.patient.firstName,
      lastName: story.patient.lastName,
      birthDate: story.patient.birthDate,
      sexAtBirth: story.patient.sexAtBirth,
      diagnosisDate: story.patient.diagnosisDate,
      primaryLanguage: story.patient.primaryLanguage,
    },
  });

  // Create devices
  for (const d of story.devices) {
    await prisma.device.upsert({
      where: { sourceKey: d.sourceKey },
      update: {},
      create: {
        patientId: patient.id,
        type: d.type,
        manufacturer: d.manufacturer,
        model: d.model,
        sourceKey: d.sourceKey,
        status: d.status,
        lastSyncedAt: d.lastSyncedAt,
      },
    });
  }

  // Batch insert observations (glucose + insulin + meals + activity + labs)
  const allObs = [
    ...story.glucose.map((o) => ({
      patientId: patient.id,
      type: o.type as 'GLUCOSE',
      value: o.value,
      unit: o.unit,
      observedAt: o.observedAt,
      sourceType: o.sourceType,
    })),
    ...story.insulin.map((o) => ({
      patientId: patient.id,
      type: o.type as 'INSULIN',
      value: o.value,
      unit: o.unit,
      observedAt: o.observedAt,
      sourceType: o.sourceType,
      metadata: o.metadata,
    })),
    ...story.meals.map((o) => ({
      patientId: patient.id,
      type: o.type as 'CARBS',
      value: o.value,
      unit: o.unit,
      observedAt: o.observedAt,
      sourceType: o.sourceType,
    })),
    ...story.activity.map((o) => ({
      patientId: patient.id,
      type: o.type as 'ACTIVITY',
      value: o.value,
      unit: o.unit,
      observedAt: o.observedAt,
      sourceType: o.sourceType,
      metadata: o.metadata,
    })),
    ...story.labs.map((o) => ({
      patientId: patient.id,
      type: o.type as 'LAB',
      subType: o.subType,
      value: o.value,
      unit: o.unit,
      observedAt: o.observedAt,
      sourceType: o.sourceType,
      metadata: o.metadata,
    })),
  ];

  // Insert in chunks to avoid overwhelming Postgres
  const CHUNK = 5000;
  for (let i = 0; i < allObs.length; i += CHUNK) {
    await prisma.observation.createMany({
      data: allObs.slice(i, i + CHUNK),
    });
  }

  // Create alerts
  for (const a of story.alerts) {
    await prisma.alert.create({
      data: {
        patientId: patient.id,
        type: a.type,
        severity: a.severity,
        status: a.status,
        triggeredAt: a.triggeredAt,
        explanation: a.explanation,
      },
    });
  }

  // Create tasks
  for (const t of story.tasks) {
    await prisma.task.create({
      data: {
        patientId: patient.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignedToUserId: clinicianId,
        createdByUserId: educatorId,
        dueAt: t.dueAt,
      },
    });
  }

  // Create consent records (vary by patient index for demo variety)
  await prisma.consentRecord.createMany({
    data: [
      { patientId: patient.id, consentType: 'DATA_SHARING', status: 'GRANTED', grantedAt: new Date() },
      { patientId: patient.id, consentType: 'RESEARCH', status: index % 3 === 0 ? 'GRANTED' : 'PENDING' },
      { patientId: patient.id, consentType: 'DEVICE_ACCESS', status: 'GRANTED', grantedAt: new Date() },
    ],
  });

  // Create risk assessment
  await prisma.riskAssessment.create({
    data: {
      patientId: patient.id,
      score: story.risk.score,
      tier: story.risk.tier,
      factors: story.risk.factors,
      modelVersion: story.risk.modelVersion,
      sourceWindowStart: story.risk.sourceWindowStart,
      sourceWindowEnd: story.risk.sourceWindowEnd,
      computedAt: story.risk.computedAt,
    },
  });

  return allObs.length;
}

async function main() {
  console.log('Seeding database with synthetic data...');
  const start = Date.now();

  const { clinician, educator } = await seedUsers();
  console.log('  Users created.');

  // Generate 30 patients (6 per archetype)
  console.log('Generating synthetic patient stories...');
  const stories = generateAllStories(6, 42);
  console.log(`  Generated ${stories.length} patient stories.`);

  let totalObs = 0;
  for (let i = 0; i < stories.length; i++) {
    const story = stories[i]!;
    const obsCount = await seedStory(story, clinician.id, educator.id, i);
    totalObs += obsCount;
    process.stdout.write(`  Patient ${i + 1}/${stories.length} [${story.archetype.label}] — ${obsCount} observations\n`);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nSeed complete in ${elapsed}s.`);
  console.log(`  Users: ${await prisma.user.count()}`);
  console.log(`  Patients: ${await prisma.patient.count()}`);
  console.log(`  Devices: ${await prisma.device.count()}`);
  console.log(`  Observations: ${totalObs}`);
  console.log(`  Alerts: ${await prisma.alert.count()}`);
  console.log(`  Tasks: ${await prisma.task.count()}`);
  console.log(`  Risk Assessments: ${await prisma.riskAssessment.count()}`);
  console.log(`  Consent Records: ${await prisma.consentRecord.count()}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
