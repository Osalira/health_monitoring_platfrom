/**
 * Database seed script.
 *
 * Creates minimal demo data for local development.
 * Synthetic patient data generation is handled separately in Epic 6.
 *
 * Usage: pnpm --filter @t1d/database db:seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo clinician user (matches packages/auth demo user)
  const clinician = await prisma.user.upsert({
    where: { email: 'dr.chen@t1d-clinic.demo' },
    update: {},
    create: {
      id: 'usr_clinician_01',
      email: 'dr.chen@t1d-clinic.demo',
      displayName: 'Dr. Sarah Chen',
      role: 'CLINICIAN',
      localePreference: 'en',
      themePreference: 'light',
    },
  });

  // Create demo educator user
  const educator = await prisma.user.upsert({
    where: { email: 'marc.dupont@t1d-clinic.demo' },
    update: {},
    create: {
      id: 'usr_educator_01',
      email: 'marc.dupont@t1d-clinic.demo',
      displayName: 'Marc Dupont',
      role: 'EDUCATOR',
      localePreference: 'fr',
      themePreference: 'light',
    },
  });

  // Create demo admin user
  await prisma.user.upsert({
    where: { email: 'admin@t1d-clinic.demo' },
    update: {},
    create: {
      id: 'usr_admin_01',
      email: 'admin@t1d-clinic.demo',
      displayName: 'Clinic Admin',
      role: 'ADMIN',
      localePreference: 'en',
      themePreference: 'dark',
    },
  });

  // Create a sample patient
  const patient = await prisma.patient.upsert({
    where: { externalRef: 'demo-patient-001' },
    update: {},
    create: {
      externalRef: 'demo-patient-001',
      firstName: 'Alex',
      lastName: 'Martin',
      birthDate: new Date('2005-03-15'),
      sexAtBirth: 'M',
      diagnosisDate: new Date('2012-09-01'),
      primaryLanguage: 'en',
    },
  });

  // Create a sample device
  await prisma.device.upsert({
    where: { sourceKey: 'demo-cgm-001' },
    update: {},
    create: {
      patientId: patient.id,
      type: 'CGM',
      manufacturer: 'Dexcom',
      model: 'G7',
      sourceKey: 'demo-cgm-001',
      status: 'ACTIVE',
      lastSyncedAt: new Date(),
    },
  });

  // Create a sample task
  await prisma.task.create({
    data: {
      patientId: patient.id,
      title: 'Review glucose trends',
      description: 'Weekly check on CGM data patterns',
      status: 'OPEN',
      priority: 'MEDIUM',
      assignedToUserId: clinician.id,
      createdByUserId: educator.id,
      dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Seed complete.');
  console.log(`  Users: ${await prisma.user.count()}`);
  console.log(`  Patients: ${await prisma.patient.count()}`);
  console.log(`  Devices: ${await prisma.device.count()}`);
  console.log(`  Tasks: ${await prisma.task.count()}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
