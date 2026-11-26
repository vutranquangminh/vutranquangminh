import "server-only";

/**
 * Private contact-card data. Never committed: it comes from environment variables
 * (Vercel → Settings → Environment Variables; locally .env.local, which git ignores).
 *
 *   CARD_TOKEN  secret path segment: the card lives at /c/<CARD_TOKEN>
 *   CARD_DATA   JSON matching PrivateCard below (see .env.example)
 *
 * Pages and files under /c/[token] are prerendered at build time for that one token only;
 * any other token is a 404.
 */

export type PrivateEmail = {
  label: string;
  address: string;
  /** Chip logo: a file in /public/assets/logos (without extension) or "gmail". */
  logo: "newera" | "hcmut" | "gmail";
  /** vCard TYPE parameter, e.g. "INTERNET,WORK,PREF". */
  vcardType: string;
};

export type PaymentAccount = {
  key: "vcb" | "momo";
  name: string;
  holder: string;
  number: string;
  bank: string;
  bankLabel: string;
  /** Raw VietQR text encoded in the bank app's QR code. */
  qrPayload: string;
};

export type PrivateCard = {
  /** YYYY-MM-DD */
  birthday: string;
  zalo: { url: string; qrPayload: string };
  whatsapp: string;
  emails: PrivateEmail[];
  payments: PaymentAccount[];
};

export function cardToken(): string | null {
  const token = process.env.CARD_TOKEN?.trim();
  return token && /^[A-Za-z0-9_-]{12,}$/.test(token) ? token : null;
}

export function isValidToken(token: string): boolean {
  const expected = cardToken();
  return expected !== null && token === expected;
}

let cached: PrivateCard | null = null;

export function getPrivateCard(): PrivateCard {
  if (cached) return cached;
  const raw = process.env.CARD_DATA;
  if (!raw) throw new Error("CARD_DATA is not set");
  const data = JSON.parse(raw) as PrivateCard;
  if (!data.birthday || !data.zalo?.qrPayload || !Array.isArray(data.payments) || !Array.isArray(data.emails)) {
    throw new Error("CARD_DATA is missing required fields (see .env.example)");
  }
  cached = data;
  return data;
}

/** YYYY-MM-DD → DD/MM/YYYY */
export function displayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

export function cardPath(token: string, file = ""): string {
  return `/c/${token}${file ? `/${file}` : ""}`;
}
