import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { fontVariables } from "./fonts";
import { profile } from "./data/profile";

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: `${profile.name} · ${profile.title}`,
  description: profile.summary,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} (${profile.nickname})`,
    description: `${profile.title} · smart-retail IoT, AI healthcare and enterprise commerce`,
    url: "/",
    type: "profile",
    images: [{ url: "/assets/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/assets/og.png"] },
  icons: { icon: "/assets/icons/favicon-64.png", apple: "/assets/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`scroll-smooth ${fontVariables}`}>
      <body className="min-h-dvh overflow-x-hidden">
        {children}
        <Toaster position="bottom-center" />
        {process.env.NODE_ENV === "production" && (
          // Vercel Web Analytics (cookieless). Enable once in Vercel → project → Analytics.
          <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
