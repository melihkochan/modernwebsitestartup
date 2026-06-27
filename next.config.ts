import type { NextConfig } from "next";
import dns from "node:dns";

// Resolve connection timeouts (UND_ERR_CONNECT_TIMEOUT) on systems with broken IPv6 DNS setups
// (e.g. fe80::1 link-local DNS timeouts). Forces Node.js to prefer IPv4 first for DNS resolution.
dns.setDefaultResultOrder("ipv4first");

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
