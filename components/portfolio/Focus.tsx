import { CpuIcon, FirstAidKitIcon, GraduationCapIcon, StorefrontIcon } from "@phosphor-icons/react/dist/ssr";
import TechBadge from "./TechBadge";
import SectionHeading, { Section } from "./SectionHeading";
import { focusAreas } from "@/app/data/profile";

const ICONS = [CpuIcon, FirstAidKitIcon, StorefrontIcon, GraduationCapIcon];

export default function Focus() {
  return (
    <Section id="focus">
      <SectionHeading
        eyebrow="Where I work"
        title={<>Four domains, <span className="silver-text">one stack</span> end to end.</>}
        intro="Hardware at the edge, AI in the middle, web and mobile at the front. I'm most useful where those meet."
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {focusAreas.map((area, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <li key={area.title} className="panel flex flex-col rounded-2xl p-6">
              <Icon aria-hidden className="size-6 text-silver" weight="light" />
              <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight">{area.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted-foreground">{area.body}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {area.tags.map((t) => (
                  <TechBadge key={t}>{t}</TechBadge>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
