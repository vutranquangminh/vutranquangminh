"use client";

/**
 * The contact card's interactive pieces. Everything else on the page is a server component;
 * QR codes arrive here as ready-made SVG strings rendered on the server.
 */
import { createContext, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { QrCodeIcon, UserPlusIcon, WalletIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type PayAccountView = {
  key: string;
  name: string;
  holder: string;
  number: string;
  bank: string;
  bankLabel: string;
  logo: string;
  logoFill?: boolean;
  qrSvg: string;
};

const dialogClass = "max-h-[calc(100dvh-32px)] w-[min(380px,calc(100vw-32px))] overflow-y-auto rounded-3xl border-line bg-[linear-gradient(180deg,#1a1a1d,var(--card))] p-5 sm:max-w-[380px]";
const titleClass = "eyebrow text-left";

function QrImage({ svg, label }: { svg: string; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="mx-auto aspect-square w-full max-w-[248px] rounded-2xl bg-white p-3 [&>svg]:size-full"
      // Generated on the server by lib/qr.ts from our own data.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/* ---------------------------------------------------------------- Payment */

const PayContext = createContext<(tab: string) => void>(() => {});

export function PayProvider({ accounts, children }: { accounts: PayAccountView[]; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(accounts[0]?.key ?? "");

  // Deep link used by the home-screen widget: ?pay=vcb or ?pay=momo opens that QR right away.
  useEffect(() => {
    const pay = new URLSearchParams(window.location.search).get("pay");
    if (pay && accounts.some((a) => a.key === pay)) {
      setTab(pay);
      setOpen(true);
    }
  }, [accounts]);

  const openPay = (key: string) => {
    setTab(key);
    setOpen(true);
  };

  return (
    <PayContext.Provider value={openPay}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={dialogClass}>
          <DialogHeader>
            <DialogTitle className={titleClass}>Payment</DialogTitle>
            <DialogDescription className="sr-only">Scan a VietQR code or copy the account number.</DialogDescription>
          </DialogHeader>
          <Tabs value={tab} onValueChange={setTab} className="gap-4">
            <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl border border-line bg-ink p-1">
              {accounts.map((a) => (
                <TabsTrigger key={a.key} value={a.key} className="h-full gap-2 rounded-lg text-[13px] font-semibold data-[state=active]:bg-panel-2">
                  <Image src={a.logo} alt="" width={18} height={18} className={cn("size-[18px] object-contain", a.logoFill && "rounded")} />
                  {a.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {accounts.map((a) => (
              <TabsContent key={a.key} value={a.key} className="flex flex-col gap-4">
                <QrImage svg={a.qrSvg} label={`${a.name} VietQR code`} />
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px]">
                  <dt className="eyebrow leading-[1.9] tracking-[0.14em]">Holder</dt>
                  <dd className="text-right font-medium">{a.holder}</dd>
                  <dt className="eyebrow leading-[1.9] tracking-[0.14em]">Account</dt>
                  <dd className="text-right font-mono font-bold tracking-wide break-all">{a.number}</dd>
                  <dt className="eyebrow leading-[1.9] tracking-[0.14em]">{a.bankLabel}</dt>
                  <dd className="text-right font-medium">{a.bank}</dd>
                </dl>
                <CopyButton look="block" value={a.number} label="account number">Copy account number</CopyButton>
              </TabsContent>
            ))}
          </Tabs>
          <p className="text-center text-[13px] text-muted-foreground">Scan the VietQR code with any banking or e-wallet app</p>
        </DialogContent>
      </Dialog>
    </PayContext.Provider>
  );
}

export function PayButton({ tab, className, children }: { tab: string; className?: string; children?: React.ReactNode }) {
  const openPay = useContext(PayContext);
  if (children) {
    return (
      <button type="button" className={className} onClick={() => openPay(tab)}>
        {children}
      </button>
    );
  }
  return (
    <Button type="button" variant="outline" size="tile" className={cn("w-full", className)} onClick={() => openPay(tab)}>
      <WalletIcon />
      Payment
    </Button>
  );
}

/* ---------------------------------------------------------------- Zalo */

export function ZaloButton({ url, qrSvg }: { url: string; qrSvg: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="tile" className="w-full">
          <QrCodeIcon />
          Zalo QR
        </Button>
      </DialogTrigger>
      <DialogContent className={dialogClass}>
        <DialogHeader>
          <DialogTitle className={titleClass}>Zalo</DialogTitle>
          <DialogDescription className="sr-only">Scan with the Zalo app to add me.</DialogDescription>
        </DialogHeader>
        <QrImage svg={qrSvg} label="Zalo QR code" />
        <p className="text-center text-[13px] text-muted-foreground">Scan with the Zalo app to add me</p>
        <Button asChild variant="silver" size="tile" className="w-full">
          <a href={url} target="_blank" rel="noopener noreferrer">Open in Zalo</a>
        </Button>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------------------------------------------- Save contact */

/**
 * iOS opens the contact straight from the .vcf. Android browsers only download it,
 * so on Android a short guide explains how to open the file with Contacts.
 */
export function SaveContactButton({ href, fileName }: { href: string; fileName: string }) {
  const [guide, setGuide] = useState(false);

  return (
    <>
      <Button asChild variant="silver" size="tile" className="w-full">
        <a
          href={href}
          download={fileName}
          onClick={() => {
            if (/android/i.test(navigator.userAgent)) setTimeout(() => setGuide(true), 400);
          }}
        >
          <UserPlusIcon />
          Save contact
        </a>
      </Button>
      <Dialog open={guide} onOpenChange={setGuide}>
        <DialogContent className={dialogClass}>
          <DialogHeader>
            <DialogTitle className={titleClass}>Save contact</DialogTitle>
            <DialogDescription className="text-left text-sm">
              On Android the contact is downloaded as a file first. To add it to your contacts:
            </DialogDescription>
          </DialogHeader>
          <ol className="flex flex-col gap-2.5 text-sm">
            {[
              <>Tap <b className="text-foreground">Open</b> on the download message at the bottom of the screen, or on the download notification.</>,
              <>If you&apos;re asked which app to use, choose <b className="text-foreground">Contacts</b>.</>,
              <>Tap <b className="text-foreground">Import</b> or <b className="text-foreground">Save</b>.</>,
            ].map((step, i) => (
              <li key={i} className="grid grid-cols-[24px_1fr] gap-2.5 text-muted-foreground">
                <span className="silver-fill grid size-6 place-items-center rounded-md font-mono text-xs font-bold">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-center text-[13px] text-muted-foreground">
            Can&apos;t find it? Open <b className="text-foreground">Files</b> → <b className="text-foreground">Downloads</b> → <code className="font-mono text-xs text-foreground">{fileName}</code>
          </p>
          <div className="grid gap-2">
            <Button asChild variant="outline" size="tile">
              <a href={href} download={fileName}>Download again</a>
            </Button>
            <Button type="button" variant="silver" size="tile" onClick={() => setGuide(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ---------------------------------------------------------------- Offline */

/** Registers the service worker so the card (and its QR codes) open without signal after one visit. */
export function OfflineSupport() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
