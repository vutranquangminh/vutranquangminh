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
    return [
      {
        // Private contact card (secret path under /c/): never indexed, never leaks its URL via Referer,
        // never stored by shared caches.
        source: "/c/:path*",
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
