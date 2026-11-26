import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRightIcon,
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  PhoneIcon,
  SquaresFourIcon,
  TelegramLogoIcon,
  ThreadsLogoIcon,
  TiktokLogoIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import PlatinumCard from "@/app/components/PlatinumCard";
import { OfflineSupport, PayButton, PayProvider, SaveContactButton, ZaloButton, type PayAccountView } from "@/app/components/card/interactive";
import { ZALO_PATH } from "@/app/components/card/icons";
import { profile } from "@/app/data/profile";
import { socialLinks, type SocialIcon } from "@/app/data/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { cardPath, displayDate, getPrivateCard, hasPrivateCard } from "@/lib/private-card";
import { qrSvg } from "@/lib/qr";

// Prerendered at build time from CARD_DATA; a 404 when it is not set.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: profile.name,
  description: `${profile.name} (${profile.nickname}) · Software Developer at NewEra Inc`,
  // Personal page: never indexed, and never sends its URL to the sites it links to.
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
  alternates: { canonical: null },
  openGraph: {
    title: `${profile.name} (${profile.nickname})`,
    description: "Software Developer @ NewEra Inc · tap to connect",
    url: cardPath(),
    images: [{ url: "/assets/og.png", width: 1200, height: 630 }],
  },
  manifest: cardPath("manifest.webmanifest"),
  appleWebApp: { capable: true, title: profile.nickname, statusBarStyle: "black-translucent" },
};

const BRAND: Record<SocialIcon, React.ComponentType<{ className?: string; weight?: "fill" | "regular" }>> = {
  github: GithubLogoIcon,
  linkedin: LinkedinLogoIcon,
  facebook: FacebookLogoIcon,
  instagram: InstagramLogoIcon,
  threads: ThreadsLogoIcon,
  tiktok: TiktokLogoIcon,
  telegram: TelegramLogoIcon,
};

const EMAIL_LOGO: Record<string, string> = { newera: "/assets/logos/newera.svg", hcmut: "/assets/logos/hcmut.png" };

/* ------------------------------------------------------------------ building blocks */

function Chip({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="grid size-[38px] shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[linear-gradient(145deg,#f8f8fa,#dcdce1)] text-[#141416] shadow-[inset_0_1px_0_rgb(255_255_255/.9),0_2px_6px_rgb(0_0_0/.35)] [&_svg]:size-5"
      style={color ? { color } : undefined}
    >
      {children}
    </span>
  );
}

function Value({ text, breakAt }: { text: string; breakAt?: string }) {
  if (!breakAt || !text.includes(breakAt)) return <>{text}</>;
  const i = text.indexOf(breakAt);
  return <>{text.slice(0, i)}<wbr />{text.slice(i)}</>;
}

type RowProps = {
  name: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  copy?: { value: string; label: string };
  breakAt?: string;
};

function Row({ name, value, href, icon, copy, breakAt }: RowProps) {
  const external = href.startsWith("http");
  return (
    <li className="flex min-h-[62px] items-center gap-3 pr-3">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group flex min-w-0 flex-1 items-center gap-3 self-stretch py-2.5 pl-3 active:opacity-70"
      >
        {icon}
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[15px] leading-tight font-semibold group-hover:underline group-hover:underline-offset-3">{name}</span>
          <span className="font-mono text-[13px] leading-snug [overflow-wrap:anywhere] text-muted-foreground">
            <Value text={value} breakAt={breakAt} />
          </span>
        </span>
      </a>
      {copy ? <CopyButton value={copy.value} label={copy.label} /> : <ArrowUpRightIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />}
    </li>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5" aria-label={title}>
      <h2 className="eyebrow px-0.5">{title}</h2>
      <ul className="panel divide-y divide-line overflow-hidden rounded-2xl">{children}</ul>
    </section>
  );
}

/* ------------------------------------------------------------------ page */

export default async function ContactCardPage() {
  if (!hasPrivateCard()) notFound();

  const card = getPrivateCard();
  const [zaloQr, ...payQrs] = await Promise.all([qrSvg(card.zalo.qrPayload), ...card.payments.map((p) => qrSvg(p.qrPayload))]);
  const accounts: PayAccountView[] = card.payments.map((p, i) => ({
    key: p.key,
    name: p.name,
    holder: p.holder,
    number: p.number,
    bank: p.bank,
    bankLabel: p.bankLabel,
    logo: p.key === "vcb" ? "/assets/logos/vietcombank.png" : "/assets/logos/momo.png",
    logoFill: p.key === "momo",
    qrSvg: payQrs[i],
  }));
  const vcf = cardPath("contact.vcf");

  return (
    <PayProvider accounts={accounts}>
      <main className="mx-auto grid max-w-[440px] gap-8 px-4 pt-[max(24px,env(safe-area-inset-top))] pb-[max(32px,env(safe-area-inset-bottom))] min-[760px]:max-w-[1000px] min-[760px]:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] min-[760px]:items-start min-[760px]:gap-x-12 min-[760px]:py-14">
        <div className="flex min-w-0 flex-col gap-7 min-[760px]:sticky min-[760px]:top-10">
          <header className="flex flex-col gap-5">
            <PlatinumCard dateLabel={["BORN", "ON"]} dateValue={displayDate(card.birthday)} />
            <div className="flex items-center gap-3.5 px-0.5">
              <Image
                src="/assets/avatar.jpg"
                alt={`Portrait of ${profile.name}`}
                width={56}
                height={56}
                priority
                className="size-14 rounded-full object-cover shadow-[0_0_0_1px_#3a3a40,0_0_0_3px_var(--background),0_0_0_4px_#2c2c31]"
              />
              <div className="min-w-0">
                <h1 className="text-[clamp(20px,5.8vw,24px)] leading-tight font-semibold tracking-tight text-balance">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Software Developer @{" "}
                  <a href="https://newera.inc" target="_blank" rel="noopener noreferrer" className="font-medium whitespace-nowrap text-foreground">NewEra Inc</a>
                </p>
              </div>
            </div>
          </header>

          <nav aria-label="Quick actions" className="grid grid-cols-2 gap-2 max-[299px]:grid-cols-1">
            <SaveContactButton href={vcf} fileName="Vu-Tran-Quang-Minh.vcf" />
            <Button asChild variant="outline" size="tile" className="w-full">
              <a href={profile.phoneHref}><PhoneIcon />Call</a>
            </Button>
            <ZaloButton url={card.zalo.url} qrSvg={zaloQr} />
            <PayButton tab={accounts[0]?.key ?? "vcb"} />
            <Button asChild variant="outline" size="tile" className="col-span-2 w-full max-[299px]:col-span-1">
              <Link href="/"><SquaresFourIcon />View portfolio</Link>
            </Button>
          </nav>
        </div>

        <div className="flex min-w-0 flex-col gap-7">
          <Group title="Contact">
            <Row name="Phone" value={profile.phoneCard} href={profile.phoneHref} icon={<Chip color="#16a34a"><PhoneIcon /></Chip>} copy={{ value: profile.phoneHref.replace("tel:", ""), label: "phone number" }} />
            <Row name="Zalo" value={profile.name} href={card.zalo.url} icon={<Chip color="#0068ff"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d={ZALO_PATH} /></svg></Chip>} />
            <Row name="WhatsApp" value={profile.phone} href={card.whatsapp} icon={<Chip color="#25d366"><WhatsappLogoIcon weight="fill" /></Chip>} />
            {socialLinks.filter((s) => s.icon === "telegram").map((s) => {
              const Icon = BRAND[s.icon];
              return <Row key={s.name} name={s.name} value={s.value} href={s.href} icon={<Chip color={s.color}><Icon weight="fill" /></Chip>} />;
            })}
          </Group>

          <Group title="Social">
            {socialLinks.filter((s) => s.icon !== "telegram").map((s) => {
              const Icon = BRAND[s.icon];
              return <Row key={s.name} name={s.name} value={s.value} href={s.href} icon={<Chip color={s.color}><Icon weight="fill" /></Chip>} />;
            })}
          </Group>

          <Group title="Email">
            {[card.emails[0], { label: "Work", address: profile.email, logo: "gmail" as const }, ...card.emails.slice(1)]
              .filter(Boolean)
              .map((e) => (
                <Row
                  key={e.address}
                  name={e.label}
                  value={e.address}
                  href={`mailto:${e.address}`}
                  breakAt="@"
                  copy={{ value: e.address, label: "email" }}
                  icon={
                    e.logo === "gmail" ? (
                      <Chip color="#ea4335"><EnvelopeSimpleIcon weight="fill" /></Chip>
                    ) : (
                      <Chip><Image src={EMAIL_LOGO[e.logo]} alt="" width={22} height={22} className="size-[22px] object-contain" /></Chip>
                    )
                  }
                />
              ))}
          </Group>

          <section className="flex flex-col gap-2.5" aria-label="Payment">
            <h2 className="eyebrow px-0.5">Payment</h2>
            <ul className="panel divide-y divide-line overflow-hidden rounded-2xl">
              {accounts.map((a) => (
                <li key={a.key} className="flex min-h-[62px] items-center gap-3 pr-3">
                  <PayButton tab={a.key} className="group flex min-w-0 flex-1 cursor-pointer items-center gap-3 self-stretch py-2.5 pl-3 text-left active:opacity-70">
                    <Chip>
                      <Image src={a.logo} alt="" width={36} height={36} className={a.logoFill ? "size-full" : "size-[22px] object-contain"} />
                    </Chip>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[15px] leading-tight font-semibold group-hover:underline group-hover:underline-offset-3">{a.name}</span>
                      <span className="font-mono text-[13px] [overflow-wrap:anywhere] text-muted-foreground">{a.number}</span>
                    </span>
                  </PayButton>
                  <CopyButton value={a.number} label="account number" />
                </li>
              ))}
            </ul>
          </section>

          <footer className="pt-1 text-center font-heading text-[10.5px] font-semibold tracking-[0.2em] text-dim uppercase">
            Tap the card to open this page again
          </footer>
        </div>
      </main>
      <OfflineSupport />
    </PayProvider>
  );
}
