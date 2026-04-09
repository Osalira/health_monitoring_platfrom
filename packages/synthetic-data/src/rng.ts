/**
 * Deterministic seeded PRNG using mulberry32.
 * Produces repeatable output given the same seed.
 */
export function createRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = ReturnType<typeof createRng>;

/** Random float in [min, max) */
export function randFloat(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min);
}

/** Random integer in [min, max] inclusive */
export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(randFloat(rng, min, max + 1));
}

/** Pick a random element from an array */
export function randPick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

/** Gaussian-ish random using Box-Muller (pair) */
export function randGaussian(rng: Rng, mean: number, stdDev: number): number {
  const u1 = rng() || 0.0001;
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}

/** Return true with given probability [0,1] */
export function randChance(rng: Rng, probability: number): boolean {
  return rng() < probability;
}
