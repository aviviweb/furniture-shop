/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@furniture/ui', '@furniture/shared'],
  // Railway will handle port binding automatically
  // Multiple domains/subdomains are handled by middleware.ts
};

export default nextConfig;


