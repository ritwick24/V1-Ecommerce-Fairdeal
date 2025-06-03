/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ADMIN_USER: process.env.ADMIN_USER,
    ADMIN_PASS: process.env.ADMIN_PASS,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
    // Allow all localhost images
    domains: ['localhost'],
    // Disable optimization for easier debugging
    unoptimized: true,
  },
}

export default nextConfig
