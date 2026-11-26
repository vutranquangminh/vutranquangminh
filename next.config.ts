import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  // Only bundle the Phosphor icons and Radix primitives that are actually imported.
  experimental: { optimizePackageImports: ["@phosphor-icons/react", "radix-ui"] },
  async redirects() {
    // The portfolio used to live at /portfolio; it is the home page now.
    return [{ source: "/portfolio", destination: "/", permanent: true }];
  },
  async headers() {
    // Order matters: when several rules set the same header, the last match wins,
    // so the private card's stricter rules come after the site-wide ones.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache" }] },
      { source: "/assets/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
      {
        // Contact card (/card and its files): never indexed, never sends its URL via Referer,
        // never stored by shared caches.
        source: "/card/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "private, no-cache" },
        ],
      },
    ];
  },
};

export default nextConfig;
