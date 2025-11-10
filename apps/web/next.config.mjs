/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@furniture/ui', '@furniture/shared'],
  // Railway will handle port binding automatically
};

export default nextConfig;


