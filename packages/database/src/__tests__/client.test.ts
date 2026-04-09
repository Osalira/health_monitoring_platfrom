import { describe, it, expect } from 'vitest';
import { PrismaClient, prisma } from '../index';

describe('database package exports', () => {
  it('exports PrismaClient class', () => {
    expect(PrismaClient).toBeDefined();
    expect(typeof PrismaClient).toBe('function');
  });

  it('exports a singleton prisma instance', () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe('function');
    expect(typeof prisma.$disconnect).toBe('function');
  });

  it('singleton returns the same instance on re-import', async () => {
    const { prisma: prisma2 } = await import('../index');
    expect(prisma2).toBe(prisma);
  });
});
