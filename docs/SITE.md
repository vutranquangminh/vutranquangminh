# vutranquangminh.vercel.app

One Next.js 15 app, two pages:

| Route | Page | Who sees it |
| --- | --- | --- |
| **`/`** | **Portfolio** (from the CV) | Public, indexable by search engines |
| **`/card`** | **Contact card** (opened by the NFC card): save contact, call, Zalo/WhatsApp/Telegram, socials, emails, Vietcombank/MoMo QR | Anyone with the link; not indexed, not linked from the portfolio |

`/portfolio` (the old address) redirects to `/`. The repo's `README.md` is the GitHub profile README and is not part of the site.

**Stack:** Next.js App Router (server components, static generation), Tailwind CSS v4, shadcn/ui (Radix), Phosphor Icons, `next/font`.

---

## Contents

- [Privacy model](#privacy-model)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Run it locally](#run-it-locally)
- [Deploy to Vercel](#deploy-to-vercel)
- [Write the URL to the NFC card](#write-the-url-to-the-nfc-card)
- [Edit the content](#edit-the-content)
- [iPhone home-screen QR widget](#iphone-home-screen-qr-widget)
- [Performance](#performance)
- [Design](#design)
- [Test checklist](#test-checklist)
- [Troubleshooting](#troubleshooting)

---

## Privacy model

This repo is **public**, so nothing private may ever be committed.

| Data | Where it lives |
| --- | --- |
| Name, title, phone, work email, LinkedIn, GitHub, social handles, CV, portfolio text | In the repo (it is on the CV and the portfolio anyway) |
| **Birthday**, **company / university / personal emails**, **Zalo and WhatsApp links**, **bank and MoMo accounts and their QR payloads** | **Only** in the `CARD_DATA` environment variable (Vercel, and `.env.local` on your machine) |

How the card's data stays private:

- **Generated, not stored:** the QR codes (inline SVG), the vCard (`contact.vcf`), the install manifest, the widget QR images and the filled-in widget script are all generated at build time from `CARD_DATA`, and only exist under `/card`.
- **Server-only:** `lib/private-card.ts` imports `server-only`, so private data can never be bundled into client JavaScript.
- **No leaking:** the card sends `Referrer-Policy: no-referrer` and every external link has `rel="noreferrer"`, so sites you open from the card (Zalo, Facebook…) never see its URL. It also sends `X-Robots-Tag: noindex, nofollow, noarchive` and `Cache-Control: private`.
- **Not advertised:** the portfolio and README never link to `/card`, and it is not in the sitemap. It is not secret, though: anyone who has or guesses the address can open it. That's fine for a contact card you hand out by tapping.

**Rules for contributors (including future you):** never commit `.env*` files (git ignores them). Never hard-code an account number, private email or QR payload. Put new private fields in `CARD_DATA` and the `PrivateCard` type.

---

## Project structure

```
app/
├── layout.tsx                 # Root layout: fonts, metadata, Toaster, analytics
├── globals.css                # Tailwind v4 + shadcn tokens mapped to the platinum palette
├── fonts.ts                   # Inter, Montserrat, Pinyon Script, JetBrains Mono (next/font)
├── page.tsx                   # Portfolio (/)
├── robots.ts, sitemap.ts      # Portfolio only
├── data/
│   ├── profile.ts             # PUBLIC details + all portfolio content (from the CV)
│   └── card.ts                # PUBLIC social links shown on the card
├── components/
│   ├── PlatinumCard.tsx       # The card artwork (shared); date slot is a prop
│   └── card/                  # Card page client parts (dialogs, tabs, save contact) + Zalo icon
└── card/                      # Contact card (/card), prerendered from CARD_DATA
    ├── page.tsx
    ├── contact.vcf/route.ts
    ├── manifest.webmanifest/route.ts
    ├── widget.js/route.ts     # Ready-to-paste Scriptable widget
    └── widget/[file]/route.ts # qr-small.png, qr-medium.png, qr-large.png
components/
├── ui/                        # shadcn/ui: button, dialog, tabs, sheet, badge, card, separator, sonner
├── portfolio/                 # Portfolio sections (server components; Navbar is client)
└── copy-button.tsx            # Copy + toast (sonner)
lib/
├── private-card.ts            # Reads CARD_DATA (server-only)
├── qr.ts                      # QR as SVG (page) or PNG (widget)
├── vcard.ts                   # vCard 3.0 builder
├── utils.ts                   # cn()
└── widget/scriptable-widget.template.js   # Widget template with placeholders (no real data)
public/                        # Public files only: avatar, logos, icons, og.png, widget artwork, sw.js, CV
scripts/make_images.py         # Regenerates icons, og.png, widget artwork, README banner (no QR codes)
docs/SITE.md, docs/readme/banner.png
.env.example                   # Shape of CARD_DATA, with placeholders (CARD_TOKEN there is no longer used)
```

---

## Environment variables

| Name | Value |
| --- | --- |
| `CARD_DATA` | One line of JSON, shaped like `.env.example`: `birthday`, `zalo {url, qrPayload}`, `whatsapp`, `emails[]`, `payments[]`. |

- **Locally:** `.env.local` (copy `.env.example`; git ignores it).
- **Vercel:** Settings → Environment Variables, for **Production** and **Preview**. They are read at **build time**, so **redeploy** after changing them.
- **QR payload:** the raw text inside a bank or Zalo QR code. Decode the app's QR image with any scanner app. VietQR payloads start with `000201`.

Without `CARD_DATA` the site still builds and the portfolio works; `/card` is a 404.

---

## Run it locally

```bash
npm ci
npm run dev          # http://localhost:3000 (portfolio) and http://localhost:3000/card
npm run build && npm run start   # production build: needed for offline support and analytics
```

---

## Deploy to Vercel

`vercel.json` only sets `"framework": "nextjs"`; all response headers are in `next.config.ts` (site-wide first, the private card's stricter rules last so they win). Every push to `main` redeploys. Vercel blocks deployments of Next.js versions with known critical vulnerabilities (for example CVE-2025-66478), so keep `next` on the latest patch release: `npm install next@15.5 eslint-config-next@15.5`.

---

## Write the URL to the NFC card

NFC Tools (iOS/Android) → **Write → Add a record → URL** → `https://vutranquangminh.vercel.app/card` → **Write**, then hold an **NTAG213/215/216** card to the phone. Don't lock the tag until you are sure the link is final.

---

## Edit the content

| What | Where |
| --- | --- |
| Portfolio text: summary, stats, focus areas, experience, projects, skills, education, certifications | `app/data/profile.ts` |
| Public social rows on the card | `app/data/card.ts` |
| Private card data (emails, accounts, QR, birthday, Zalo/WhatsApp) | `CARD_DATA` env var, then redeploy |
| Card artwork | `app/components/PlatinumCard.tsx` |
| Card page layout | `app/card/page.tsx` (+ `app/components/card/interactive.tsx`) |
| Colors and fonts | `app/globals.css` (`:root` and `@theme inline`), `app/fonts.ts` |
| Photo | `public/assets/avatar.jpg` (640×640), then `uv run --with pillow python scripts/make_images.py` |
| CV | `public/VuTranQuangMinh_CV.pdf` |

**Add a shadcn component:** `npx shadcn@latest add <name>`. `components.json` uses Radix and Phosphor icons.

---

## iPhone home-screen QR widget

The free **[Scriptable](https://apps.apple.com/app/scriptable/id1405459188)** app shows the Vietcombank QR on Vietcombank-style artwork (small / medium / large).

1. On the iPhone, open `https://vutranquangminh.vercel.app/card/widget.js`, select all and copy.
2. Scriptable → **+** → paste → name it `Vietcombank QR` → **▶︎ Run** once online.
3. Home screen → long-press → **Edit → Add Widget → Scriptable → Large** → Edit Widget → Script: `Vietcombank QR`, When Interacting: `Open URL`.

The served script already contains the card link and your account. The template in the repo (`lib/widget/`) only has placeholders. The QR images come from `/card/widget/qr-*.png` ( whole-pixel modules at 3× with a full quiet zone, so they draw 1:1 and scan). The background and logo come from the public repo on GitHub. Everything is cached on the phone. Tapping the widget opens the card's payment QR (`?pay=vcb`).

If the QR won't scan: use the **Large** size, run the script once, and make sure the home screen style isn't **Tinted** or **Clear** (long-press → Edit → Customize), because those recolour widgets.

---

## Performance

- **Static:** both pages and every file under the card path are prerendered at build time and served from Vercel's CDN; no server work per visit.
- **Little client JavaScript:** everything is a server component except the interactive leaves (card tilt, mobile menu, dialogs/tabs, copy buttons). `optimizePackageImports` bundles only the Phosphor icons and Radix primitives that are actually used. About 150 kB first-load JS for the portfolio, about 160 kB for the card.
- **No image requests for QR codes:** inline SVG on the card page.
- **Images:** `next/image` with AVIF/WebP; the photo is the priority image.
- **Fonts:** `next/font` self-hosts and preloads only the subsets used, with no layout shift.
- **Below-the-fold sections** use `content-visibility: auto`, so the browser skips their layout until they scroll near.
- **Offline:** `public/sw.js` keeps each visited page and its assets for later visits without signal.

---

## Design

Dark only. The "platinum card" look: near-black page, graphite panels, brushed-silver accents (`silver-fill`, `silver-text` utilities), card-style micro-type (`eyebrow`), Montserrat print, Pinyon Script signature. The shadcn semantic tokens (`--background`, `--primary`, `--muted-foreground`…) are set once in `:root` in `app/globals.css`. The card artwork scales in `cqw` units. The public card shows "SHIPPING SINCE 04/2025"; only the private card shows the birthday.

---

## Test checklist

- [ ] `npm run build` passes (types and lint).
- [ ] `/card`: Save contact (iPhone opens it; Android shows the guide), Call, Zalo QR, Payment tabs, copy toasts, `?pay=momo`.
- [ ] `/contact.vcf` and `/assets/qr/*` are 404 (the card's files only exist under `/card/`).
- [ ] The portfolio HTML and `.next/static` contain no account number, birthday or private email.
- [ ] QR codes scan with a banking app.
- [ ] After deploying: tap the NFC card with an iPhone and an Android phone.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `/card` is a 404 after deploying | `CARD_DATA` missing or invalid in Vercel (Production). Add it and redeploy. |
| Vercel says "Vulnerable version of Next.js detected" | Update `next` to the latest patch and push. |
| Widget QR won't scan / old image | Re-copy `…/widget.js`, run it once, use Large, home screen style Default or Dark. |
| Old version after deploying | Reload twice (the service worker refreshes in the background). |
