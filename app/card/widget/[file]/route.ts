import { notFound } from "next/navigation";
import { getPrivateCard, hasPrivateCard } from "@/lib/private-card";
import { qrPng } from "@/lib/qr";

/** Module size in pixels per widget size: whole pixels at 3x, so iOS draws the code 1:1. */
const SIZES = { "qr-small.png": 8, "qr-medium.png": 9, "qr-large.png": 14 } as const;

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(SIZES).map((file) => ({ file }));
}

/** Vietcombank QR images for the iPhone widget, generated from CARD_DATA at build time. */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!hasPrivateCard() || !(file in SIZES)) notFound();
  const vcb = getPrivateCard().payments.find((p) => p.key === "vcb");
  if (!vcb) notFound();
  const png = await qrPng(vcb.qrPayload, SIZES[file as keyof typeof SIZES]);
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png", "X-Robots-Tag": "noindex" },
  });
}
