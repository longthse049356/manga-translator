import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
