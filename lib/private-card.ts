import "server-only";

/**
 * Private contact-card data for /card. Never committed (this repo is public): it comes from the
 * CARD_DATA environment variable (Vercel → Settings → Environment Variables; locally .env.local,
 * which git ignores). JSON matching PrivateCard below; see .env.example.
 *
 * The card and its files are prerendered at build time. Without CARD_DATA, /card is a 404.
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

export const CARD_PATH = "/card";

export function hasPrivateCard(): boolean {
  return Boolean(process.env.CARD_DATA?.trim());
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

export function cardPath(file = ""): string {
  return file ? `${CARD_PATH}/${file}` : CARD_PATH;
}
