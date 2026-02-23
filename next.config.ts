import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // Whitelist S3 for dynamic user avatars / team logos
      },
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
      }
    ],
  },
};

export default nextConfig;
