import { describe, it, expect } from 'vitest';
import { createRng, randInt, randPick, randGaussian, randChance } from '../rng';

describe('createRng', () => {
  it('produces deterministic output for the same seed', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);
    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());
    expect(seq1).toEqual(seq2);
  });

  it('produces different output for different seeds', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(99);
    const v1 = rng1();
    const v2 = rng2();
    expect(v1).not.toBe(v2);
  });

  it('produces values in [0, 1)', () => {
    const rng = createRng(42);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('randInt', () => {
  it('produces integers in the specified range', () => {
    const rng = createRng(42);
    for (let i = 0; i < 100; i++) {
      const v = randInt(rng, 5, 10);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(10);
      expect(Number.isInteger(v)).toBe(true);
    }
  });
});

describe('randPick', () => {
  it('picks from the array', () => {
    const rng = createRng(42);
    const arr = ['a', 'b', 'c'];
    for (let i = 0; i < 50; i++) {
      expect(arr).toContain(randPick(rng, arr));
    }
  });
});

describe('randGaussian', () => {
  it('produces values centered around the mean', () => {
    const rng = createRng(42);
    const values = Array.from({ length: 1000 }, () => randGaussian(rng, 100, 10));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    expect(mean).toBeGreaterThan(95);
    expect(mean).toBeLessThan(105);
  });
});

describe('randChance', () => {
  it('returns boolean', () => {
    const rng = createRng(42);
    const result = randChance(rng, 0.5);
    expect(typeof result).toBe('boolean');
  });
});
