
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // In a future version of Next.js, the development server will
  // not start if this is not configured.
  // @see https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  allowedDevOrigins: [
    'https://*.cloudworkstations.dev',
    'https://*.firebase.studio',
  ],
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
    return [
      {
        source: '/api/auth/:path*',
        // Proxy to the backend, removing the trailing '/api' if it exists
        destination: `${backendUrl.replace(/\/api$/, '')}/:path*`, 
      },
    ]
  },
};

export default nextConfig;
