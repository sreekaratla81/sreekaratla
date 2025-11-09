import fs from "node:fs";
import path from "node:path";
import { withContentlayer } from "next-contentlayer";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://plausible.io",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.googleusercontent.com",
      "font-src 'self' data:",
      "connect-src 'self' https://plausible.io",
      "frame-ancestors 'none'"
    ].join("; ")
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  }
];

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  },
  webpack(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'contentlayer/generated': path.join(process.cwd(), '.contentlayer/generated')
    };
    return config;
  }
};

const contentlayerConfigPaths = [
  "contentlayer.config.ts",
  "contentlayer.config.js",
  "contentlayer.config.mjs",
  "contentlayer.config.cjs"
];

const hasContentlayerConfig = contentlayerConfigPaths.some((configPath) =>
  fs.existsSync(path.join(process.cwd(), configPath))
);

if (!hasContentlayerConfig) {
  console.warn("[build] Contentlayer config not found; continuing without it.");
}

export default withContentlayer(nextConfig);
