import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jumpg-assets.tokyo-cdn.com",
      },
      {
        protocol: "https",
        hostname: "mangaplus.shueisha.co.jp",
      },
    ],
  },
};

export default nextConfig;
