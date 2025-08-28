import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  // Fix for Vercel deployment with multiple lockfiles
  outputFileTracingRoot: __dirname
};

export default withNextIntl(nextConfig);
