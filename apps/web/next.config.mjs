/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@furniture/ui', '@furniture/shared'],
  // Railway will handle port binding automatically
  // Multiple domains/subdomains are handled by middleware.ts
  // Inject environment variables at runtime
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  },
  // Webpack config to ensure env vars are available at runtime
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Make sure env vars are available on client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;


