
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent 'async_hooks' from being bundled on the client, as it's a Node.js specific module.
      // This helps when packages meant for the server inadvertently get pulled into the client bundle.
      config.resolve.fallback = {
        ...config.resolve.fallback, // Spread existing fallbacks if any
        async_hooks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
