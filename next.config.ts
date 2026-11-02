import type { NextConfig } from "next";

/**
 * Terminal Academy runs two output modes:
 *
 *  - default (dev / server): "standalone"
 *  - STATIC_EXPORT=1 (for the Android wrapper & static hosting): "export"
 *    → run `bun run build:static`, output lands in out/
 *
 * The app is deliberately 100% client-side (static content + localStorage),
 * so the static export is fully functional and works offline.
 *
 * BASE_PATH supports serving the static export from a subdirectory,
 * e.g. GitHub Pages project sites:
 *   BASE_PATH=/Terminally bun run build:static
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.BASE_PATH?.replace(/\/+$/, "") || "";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: isStaticExport ? { unoptimized: true } : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
