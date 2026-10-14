import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn1.suno.ai" },
      { protocol: "https", hostname: "cdn2.suno.ai" },
    ],
  },
};

export default nextConfig;
