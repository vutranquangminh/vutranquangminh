import { ArrowRightIcon, DownloadSimpleIcon, EnvelopeSimpleIcon, GithubLogoIcon, LinkedinLogoIcon, PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { Section } from "./SectionHeading";
import { profile } from "@/app/data/profile";

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, copy: profile.email, Icon: EnvelopeSimpleIcon },
  { label: "Phone / Zalo", value: profile.phone, href: profile.phoneHref, copy: profile.phone.replace(/\s/g, ""), Icon: PhoneIcon },
  { label: "LinkedIn", value: "in/vutranquangminh", href: profile.linkedin, Icon: LinkedinLogoIcon },
  { label: "GitHub", value: "vutranquangminh", href: profile.github, Icon: GithubLogoIcon },
];

export default function Contact() {
  return (
    <Section id="contact" className="lg:py-28">
      <div className="panel relative overflow-hidden rounded-[32px] p-7 sm:p-12">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/[0.06] blur-3xl" />
        <p className="eyebrow">Contact</p>
        <h2 className="mt-4 max-w-3xl font-heading text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
          Have a system to build? <span className="silver-text">Let&apos;s talk.</span>
        </h2>
        <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-muted-foreground">
          I&apos;m based in {profile.location}. Email works best; Zalo and phone are fine too.
        </p>

        <ul className="mt-10 grid gap-3 md:grid-cols-2">
          {channels.map(({ label, value, href, copy, Icon }) => (
            <li key={label} className="flex items-center gap-4 rounded-2xl border border-line bg-ink/40 p-4 sm:p-5">
              <Icon aria-hidden className="size-5 shrink-0 text-silver" weight="light" />
              <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener" : undefined} className="min-w-0 flex-1">
                <span className="eyebrow block">{label}</span>
                <span className="mt-1.5 block font-mono text-[15px] [overflow-wrap:anywhere]">{value}</span>
              </a>
              {copy && <CopyButton value={copy} label={label.toLowerCase()} />}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="silver" size="xl">
            <a href={`mailto:${profile.email}`}>
              Send an email <ArrowRightIcon weight="bold" />
            </a>
          </Button>
          <Button asChild variant="outline" size="xl" className="border-line-strong bg-transparent hover:border-silver">
            <a href={profile.resume} download>
              <DownloadSimpleIcon weight="bold" /> Download CV
            </a>
          </Button>
        </div>
      </div>
    </Section>
  );
}
