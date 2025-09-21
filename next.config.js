/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Output configuration for Vercel
  output: 'standalone',
  // Disable static optimization for dynamic pages
  trailingSlash: false,
  // Skip build-time database connections
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig

