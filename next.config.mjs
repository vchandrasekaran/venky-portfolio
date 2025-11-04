/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next-cache',
  experimental: {
    optimizePackageImports: ['classnames'],
  }
};
export default nextConfig;
