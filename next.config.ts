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
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  images: isStaticExport ? { unoptimized: true } : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
