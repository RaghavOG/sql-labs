import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable web workers for Monaco editor (Brave browser compatibility)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Turbopack config for Next.js 16 (empty - webpack handles Monaco)
  turbopack: {},
};

export default nextConfig;
