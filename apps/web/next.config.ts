import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@anilyst/types", "@anilyst/utils", "@anilyst/validation"],
};

export default nextConfig;
