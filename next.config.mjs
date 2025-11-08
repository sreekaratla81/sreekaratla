import { createRequire } from "module";

const req = createRequire(import.meta.url);

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

const baseConfig = {
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
  }
};

export default (async () => {
  try {
    req.resolve("contentlayer");
    const { withContentlayer } = await import("next-contentlayer");
    await import("./contentlayer.config.ts");
    return withContentlayer(baseConfig);
  } catch {
    console.warn("[build] Contentlayer config not found; continuing without it.");
    return baseConfig;
  }
})();
