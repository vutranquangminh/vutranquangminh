import { notFound } from "next/navigation";
import { getPrivateCard, hasPrivateCard } from "@/lib/private-card";
import { buildVCard } from "@/lib/vcard";

export const dynamic = "force-static";

/** "Save contact" file, generated at build time from CARD_DATA. */
export async function GET() {
  if (!hasPrivateCard()) notFound();
  return new Response(buildVCard(getPrivateCard()), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Vu-Tran-Quang-Minh.vcf"',
      "X-Robots-Tag": "noindex",
    },
  });
}
