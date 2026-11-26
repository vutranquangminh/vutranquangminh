"use client";

import { CopyIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  /** What is copied, for the toast and screen readers: "email", "account number"… */
  label: string;
  /** "pill": small outline button in list rows. "block": full-width silver button. */
  look?: "pill" | "block";
  children?: React.ReactNode;
  className?: string;
};

export function CopyButton({ value, label, look = "pill", children, className }: Props) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Copied ${label}`);
    } catch {
      // Clipboard blocked (some in-app browsers): show the value so it can be copied by hand.
      toast(value);
    }
  }

  if (look === "block") {
    return (
      <Button type="button" variant="silver" size="tile" className={cn("w-full", className)} onClick={copy}>
        {children ?? `Copy ${label}`}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className={cn(
        "h-9 shrink-0 rounded-full border-border bg-transparent px-3 font-heading text-[10.5px] font-semibold tracking-[0.14em] text-muted-foreground uppercase hover:text-foreground max-[359px]:w-9 max-[359px]:px-0",
        className,
      )}
    >
      <CopyIcon className="size-3.5" />
      <span className="max-[359px]:sr-only">Copy</span>
    </Button>
  );
}
