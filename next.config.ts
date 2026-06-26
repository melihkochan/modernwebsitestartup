import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict mode for React 19 — catches side effects early
  reactStrictMode: true,

  // Image optimization — allow Kick CDN and Supabase storage domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.kick.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "cdn.cloudflare.steamstatic.com",
      },
    ],
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default nextConfig;
