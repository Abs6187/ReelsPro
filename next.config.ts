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
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "avatar.vercel.sh" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
};

export default nextConfig;
