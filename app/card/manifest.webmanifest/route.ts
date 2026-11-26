import { notFound } from "next/navigation";
import { profile } from "@/app/data/profile";
import { cardPath, getPrivateCard, hasPrivateCard } from "@/lib/private-card";

export const dynamic = "force-static";

/** Install-as-app manifest for the card ("William" on the home screen). */
export async function GET() {
  if (!hasPrivateCard()) notFound();
  const home = cardPath();
  const manifest = {
    id: home,
    name: profile.name,
    short_name: profile.nickname,
    description: `Contact card of ${profile.name} (${profile.nickname}).`,
    lang: "en",
    start_url: home,
    scope: `${home}`,
    display: "standalone",
    background_color: "#0b0b0c",
    theme_color: "#0b0b0c",
    icons: [
      { src: "/assets/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/assets/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/assets/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: getPrivateCard().payments.map((p) => ({
      name: `${p.name} QR`,
      short_name: p.name,
      url: `${home}?pay=${p.key}`,
      icons: [{ src: p.key === "vcb" ? "/assets/logos/vietcombank.png" : "/assets/logos/momo.png", sizes: "96x96", type: "image/png" }],
    })),
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json", "X-Robots-Tag": "noindex" },
  });
}
