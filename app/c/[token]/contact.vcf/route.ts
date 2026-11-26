import { notFound } from "next/navigation";
import { cardToken, getPrivateCard, isValidToken } from "@/lib/private-card";
import { buildVCard } from "@/lib/vcard";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  const token = cardToken();
  return token ? [{ token }] : [];
}

/** "Save contact" file, generated at build time from CARD_DATA. */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!isValidToken(token)) notFound();
  return new Response(buildVCard(getPrivateCard()), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Vu-Tran-Quang-Minh.vcf"',
      "X-Robots-Tag": "noindex",
    },
  });
}
