import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Vercel
  output: "standalone",
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
};

export default nextConfig;
