import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://dummyjson.com/**")],
  },
};

export default nextConfig;
