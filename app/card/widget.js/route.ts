import { readFileSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { profile } from "@/app/data/profile";
import { cardPath, getPrivateCard, hasPrivateCard } from "@/lib/private-card";

export const dynamic = "force-static";

/**
 * The ready-to-paste Scriptable widget: the public template (lib/widget) with the card link and
 * the (private) Vietcombank account filled in. Open this URL on the iPhone, copy, paste.
 */
export async function GET() {
  if (!hasPrivateCard()) notFound();
  const vcb = getPrivateCard().payments.find((p) => p.key === "vcb");
  if (!vcb) notFound();
  const template = readFileSync(path.join(process.cwd(), "lib/widget/scriptable-widget.template.js"), "utf8");
  const display = vcb.number.replace(/^(\d{4})(\d{3})(\d+)$/, "$1 $2 $3");
  const script = template
    .replaceAll("__CARD_URL__", `${profile.site}${cardPath()}`)
    .replaceAll("__HOLDER__", vcb.holder)
    .replaceAll("__NUMBER_DISPLAY__", display)
    .replaceAll("__NUMBER__", vcb.number);
  return new Response(script, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}
