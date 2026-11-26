"use client";

import { useEffect, useState } from "react";
import { ArrowDownRightIcon, DownloadSimpleIcon, ListIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { profile } from "@/app/data/profile";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled ? "border-line bg-ink/80 backdrop-blur-xl" : "border-transparent",
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="silver-text font-script text-[34px] leading-none">{profile.nickname}</span>
          <span className="eyebrow hidden sm:inline">VTQ Minh</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild variant="silver" size="xl" className="hidden h-10 sm:inline-flex">
            <a href={profile.resume} download>
              <DownloadSimpleIcon weight="bold" />
              Download CV
            </a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="size-11 rounded-full border-line bg-transparent md:hidden" aria-label="Open menu">
                <ListIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(320px,85vw)] border-line bg-ink px-6">
              <SheetHeader className="px-0">
                <SheetTitle className="silver-text w-fit font-script text-4xl font-normal">{profile.nickname}</SheetTitle>
                <SheetDescription className="eyebrow">{profile.title}</SheetDescription>
              </SheetHeader>
              <ul className="flex flex-col">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <SheetClose asChild>
                      <a href={l.href} className="flex items-center justify-between border-b border-line py-4 font-heading text-lg">
                        {l.label}
                        <ArrowDownRightIcon className="size-4 text-muted-foreground" />
                      </a>
                    </SheetClose>
                  </li>
                ))}
              </ul>
              <Button asChild variant="silver" size="xl" className="mt-6 w-full">
                <a href={profile.resume} download>
                  <DownloadSimpleIcon weight="bold" />
                  Download CV
                </a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
