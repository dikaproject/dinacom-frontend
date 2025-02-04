import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'via.placeholder.com', 'pregnacare.intechofficial.com', 'intechofficial.com', 'dinacom.intechofficial.com']
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'lib', 'src'], // Ignore ESLint for these directories
  },
  typescript: {
    ignoreBuildErrors: true, // Optionally ignore TypeScript errors during build
  },
};

export default nextConfig;
