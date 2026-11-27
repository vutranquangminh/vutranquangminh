"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRightIcon, DownloadSimpleIcon, EyeIcon } from "@phosphor-icons/react";
import { certifications } from "@/app/data/profile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Certification = (typeof certifications)[number];

/**
 * The certification list. One tap on a certificate opens it right here in a dialog (an image rendered
 * from the PDF, since phones don't show PDFs inside a page), with links to verify it at the issuer and
 * to download the PDF.
 */
export default function Certifications() {
  const [shown, setShown] = useState<Certification | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <ul className="mt-4 divide-y divide-line">
        {certifications.map((c) => {
          const body = (
            <span className="min-w-0">
              <span className="block font-heading text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{c.issuer}</span>
              <span className="mt-1 block text-[15px]">{c.name}</span>
            </span>
          );
          return (
            <li key={c.name} className="py-3.5 first:pt-0 last:pb-0">
              {c.preview ? (
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => {
                    setShown(c);
                    setOpen(true);
                  }}
                  className="group flex w-full items-center justify-between gap-4 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {body}
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                    <EyeIcon aria-hidden className="size-4" />
                    View
                  </span>
                </button>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        {/* `shown` outlives `open`, so the dialog keeps its content while it animates closed. */}
        <DialogContent className="gap-5 p-5 sm:max-w-3xl sm:p-6">
          {shown?.preview && (
            <>
              <DialogHeader className="pr-8">
                <p className="font-heading text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{shown.issuer}</p>
                <DialogTitle className="text-lg leading-snug sm:text-xl">{shown.name}</DialogTitle>
                <DialogDescription className="sr-only">Certificate issued by {shown.issuer}.</DialogDescription>
              </DialogHeader>
              <Image
                src={shown.preview.src}
                width={shown.preview.width}
                height={shown.preview.height}
                alt={`${shown.name} certificate`}
                sizes="(max-width: 768px) 92vw, 720px"
                className="h-auto max-h-[65dvh] w-full rounded-lg bg-panel-2 object-contain ring-1 ring-line"
              />
              <DialogFooter className="-mx-5 -mb-5 sm:-mx-6 sm:-mb-6">
                {shown.url && (
                  <Button asChild variant="outline">
                    <a href={shown.url} target="_blank" rel="noopener">
                      Verify at {shown.issuer}
                      <ArrowUpRightIcon aria-hidden />
                    </a>
                  </Button>
                )}
                {shown.pdf && (
                  <Button asChild>
                    <a href={shown.pdf} download>
                      <DownloadSimpleIcon aria-hidden />
                      Download PDF
                    </a>
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
