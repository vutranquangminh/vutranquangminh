import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import PlatinumCard from "@/app/components/PlatinumCard";
import { Button } from "@/components/ui/button";
import { profile, stats } from "@/app/data/profile";

export default function Hero() {
  return (
    <section id="top" className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-32 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-40 lg:pb-28">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <Image src="/assets/avatar.jpg" alt={`Portrait of ${profile.name}`} width={44} height={44} priority className="size-11 rounded-full object-cover ring-1 ring-line-strong" />
          <p className="eyebrow">{profile.title} · Ho Chi Minh City</p>
        </div>

        <h1 className="mt-7 font-heading text-[clamp(2.3rem,5.2vw,3.6rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance">
          I build production systems <span className="silver-text">from the edge</span> to the cloud.
        </h1>

        <p className="mt-6 max-w-[60ch] text-[17px] leading-relaxed text-muted-foreground">
          Hi, I&apos;m <span className="text-foreground">{profile.name}</span>, or{" "}
          <span className="font-script text-2xl text-silver">{profile.nickname}</span>. {profile.intro}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild variant="silver" size="xl">
            <a href="#contact">
              Get in touch
              <ArrowRightIcon weight="bold" />
            </a>
          </Button>
          <Button asChild variant="outline" size="xl" className="border-line-strong bg-transparent hover:border-silver">
            <a href="#projects">See my work</a>
          </Button>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-col-reverse justify-end">
              <dt className="mt-1 text-[13px] leading-snug text-muted-foreground">{s.label}</dt>
              <dd className="font-heading text-2xl font-light tracking-tight">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto w-full max-w-[520px] lg:max-w-none">
        <PlatinumCard dateValue={profile.careerStart} networkLabel="Full-stack" />
      </div>
    </section>
  );
}
