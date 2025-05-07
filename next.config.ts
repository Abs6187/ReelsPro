import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow production builds to complete even if there are ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
    domains: ["images.pexels.com", "avatar.vercel.sh", "randomuser.me"],
  },
};

export default nextConfig;
