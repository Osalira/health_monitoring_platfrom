import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['@t1d/ui', '@t1d/auth', '@t1d/database'],
};

export default withNextIntl(nextConfig);
