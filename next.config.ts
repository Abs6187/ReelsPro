import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep heavy/native server packages outside Turbopack's bundle graph.
  // These are resolved by native Node.js require at runtime instead.
  serverExternalPackages: [
    "@ffmpeg-installer/ffmpeg",
    "@ffprobe-installer/ffprobe",
    "@tensorflow/tfjs-node",
    "@vladmandic/human",
    "fluent-ffmpeg",
    "sharp",
    "nsfwjs",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
    domains: [
      "images.pexels.com",
      "avatar.vercel.sh",
      "randomuser.me",
      "images.unsplash.com",
      "via.placeholder.com",
    ],
  },
};

export default nextConfig;
