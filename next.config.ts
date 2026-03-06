import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // EverShop local dev serves images at localhost:3000
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      // EverShop production (update when deployed)
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '/**',
      },
      // Allow any HTTPS image source for flexibility
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },

  // Allow EverShop API calls from server components
  async rewrites() {
    return [
      // Proxy /evershop-api/* → EverShop backend (useful for client-side cart calls)
      {
        source: '/evershop-api/:path*',
        destination: `${process.env.EVERSHOP_API_URL || 'http://localhost:3000'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
