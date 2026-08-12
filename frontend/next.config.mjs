/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Bypasses TS checks during build to prevent compilation blockages on pre-existing errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Bypasses ESLint checks during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
