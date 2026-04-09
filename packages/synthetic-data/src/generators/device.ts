import type { ArchetypeConfig } from '../archetypes';
import { type Rng, randPick } from '../rng';

export interface GeneratedDevice {
  type: 'CGM' | 'PUMP';
  manufacturer: string;
  model: string;
  sourceKey: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONNECTED';
  lastSyncedAt: Date;
}

const CGM_MODELS = [
  { manufacturer: 'Dexcom', model: 'G7' },
  { manufacturer: 'Dexcom', model: 'G6' },
  { manufacturer: 'Abbott', model: 'Libre 3' },
  { manufacturer: 'Abbott', model: 'Libre 2' },
  { manufacturer: 'Medtronic', model: 'Guardian 4' },
];

const PUMP_MODELS = [
  { manufacturer: 'Medtronic', model: '780G' },
  { manufacturer: 'Tandem', model: 't:slim X2' },
  { manufacturer: 'Omnipod', model: '5' },
  { manufacturer: 'Ypsomed', model: 'mylife YpsoPump' },
];

export function generateDevices(
  rng: Rng,
  patientIndex: number,
  archetype: ArchetypeConfig,
): GeneratedDevice[] {
  const now = new Date();
  const devices: GeneratedDevice[] = [];

  // Everyone gets a CGM
  const cgm = randPick(rng, CGM_MODELS);
  const cgmSyncLag = archetype.id === 'non-adherent' ? 72 : archetype.id === 'high-risk' ? 24 : 2;
  const cgmStatus = archetype.id === 'non-adherent' ? 'DISCONNECTED' as const : 'ACTIVE' as const;

  devices.push({
    type: 'CGM',
    manufacturer: cgm.manufacturer,
    model: cgm.model,
    sourceKey: `synth-cgm-${String(patientIndex).padStart(3, '0')}`,
    status: cgmStatus,
    lastSyncedAt: new Date(now.getTime() - cgmSyncLag * 60 * 60 * 1000),
  });

  // Some get a pump
  if (archetype.hasPump) {
    const pump = randPick(rng, PUMP_MODELS);
    devices.push({
      type: 'PUMP',
      manufacturer: pump.manufacturer,
      model: pump.model,
      sourceKey: `synth-pump-${String(patientIndex).padStart(3, '0')}`,
      status: 'ACTIVE',
      lastSyncedAt: new Date(now.getTime() - cgmSyncLag * 60 * 60 * 1000),
    });
  }

  return devices;
}
