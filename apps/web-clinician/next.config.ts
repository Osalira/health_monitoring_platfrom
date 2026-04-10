import type { NextConfig } from 'next';
import { join } from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Include monorepo root so Vercel traces files from packages/ correctly
  outputFileTracingRoot: join(__dirname, '../../'),
  // Force-include Prisma engine binaries and shared package files in the bundle
  outputFileTracingIncludes: {
    '/*': [
      '../../node_modules/.prisma/client/**/*',
      '../../node_modules/@prisma/client/**/*',
      '../../packages/database/**/*',
    ],
  },
  transpilePackages: [
    '@t1d/ui',
    '@t1d/auth',
    '@t1d/database',
    '@t1d/i18n',
    '@t1d/types',
    '@t1d/summary-engine',
    '@t1d/risk-engine',
  ],
};

export default withNextIntl(nextConfig);
