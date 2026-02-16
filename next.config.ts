import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "clear-wren-570.convex.cloud",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
