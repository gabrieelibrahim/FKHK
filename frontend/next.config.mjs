/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fkhk-test.vantaracloud.web.id",
      },
      {
        protocol: "http",
        hostname: "43.159.34.55",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  
  // React strict mode
  reactStrictMode: true,
};

export default nextConfig;
