/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Enable React 18 features
    appDir: true,
  },
  // Ensure proper hydration
  reactStrictMode: true,
}

export default nextConfig
