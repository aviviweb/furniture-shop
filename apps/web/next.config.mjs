/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@furniture/ui', '@furniture/shared'],
  output: 'standalone', // Optimize for Railway deployment
};

export default nextConfig;


