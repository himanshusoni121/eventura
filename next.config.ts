import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "export",

  images: {
    unoptimized: true,
  },

  trailingSlash: true,

  turbopack: {
    root: projectRoot,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;