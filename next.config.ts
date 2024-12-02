import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  distDir: "dist",
  output: 'standalone'
};

export default nextConfig;
