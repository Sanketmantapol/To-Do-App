import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "staging-storage.bdpl.com.np",
      },
    ],
  },
};

export default nextConfig;
