import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { profile } from "@/app/data/profile";
import { socialLinks } from "@/app/data/card";
import type { PrivateCard } from "./private-card";

/** vCard 3.0 for "Save contact". Built at build time from public profile data + CARD_DATA. */
export function buildVCard(card: PrivateCard): string {
  const [family, given] = ["Vũ Trần", "Quang Minh"];
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${family};${given};;;`,
    `FN:${profile.name}`,
    `NICKNAME:${profile.nickname}`,
    `BDAY:${card.birthday}`,
    "ORG:NewEra Inc",
    "TITLE:Software Developer",
    `TEL;TYPE=CELL,VOICE:${profile.phoneHref.replace("tel:", "")}`,
  ];

  // NewEra first (preferred), then the public work Gmail, then the rest.
  const [primary, ...others] = card.emails;
  if (primary) lines.push(`EMAIL;TYPE=${primary.vcardType}:${primary.address}`);
  lines.push(`EMAIL;TYPE=INTERNET,WORK:${profile.email}`);

  let item = 0;
  for (const email of others) {
    if (email.vcardType === "INTERNET") {
      item += 1;
      lines.push(`item${item}.EMAIL;TYPE=INTERNET:${email.address}`, `item${item}.X-ABLabel:${email.label}`);
    } else {
      lines.push(`EMAIL;TYPE=${email.vcardType}:${email.address}`);
    }
  }

  const links: [string, string][] = [
    ["Zalo", card.zalo.url],
    ["WhatsApp", card.whatsapp],
    ...socialLinks.map((s) => [s.name, s.href] as [string, string]),
  ];
  for (const [label, url] of links) {
    item += 1;
    lines.push(`item${item}.URL:${url}`, `item${item}.X-ABLabel:${label}`);
  }
  for (const s of socialLinks.filter((s) => s.vcardProfile)) {
    lines.push(`X-SOCIALPROFILE;TYPE=${s.vcardProfile}:${s.href}`);
  }
  lines.push(`NOTE:${card.payments.map((p) => `${p.name} ${p.number}`).join(" / ")} - ${card.payments[0]?.holder ?? ""}`);

  const photo = readFileSync(path.join(process.cwd(), "public/assets/avatar.jpg")).toString("base64");
  const photoLine = `PHOTO;ENCODING=b;TYPE=JPEG:${photo}`;
  // Fold long lines at 75 characters; continuation lines start with a space (RFC 2426).
  lines.push(photoLine.slice(0, 75));
  for (let i = 75; i < photoLine.length; i += 74) lines.push(` ${photoLine.slice(i, i + 74)}`);
  lines.push("END:VCARD");
  // vCard requires CRLF line endings.
  return `${lines.join("\r\n")}\r\n`;
}
