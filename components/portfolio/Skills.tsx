import SectionHeading, { Section } from "./SectionHeading";
import { skills } from "@/app/data/profile";

export default function Skills() {
  return (
    <Section id="skills">
      <SectionHeading eyebrow="Toolchain" title={<>The stack I <span className="silver-text">ship with.</span></>} />
      <dl className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <div key={s.group} className="bg-card p-6 sm:p-7">
            <dt className="eyebrow">{s.group}</dt>
            <dd className="mt-4 flex flex-wrap gap-2">
              {s.items.map((item) => (
                <span key={item} className="rounded-lg border border-line bg-panel-2 px-3 py-2 font-heading text-sm font-medium">
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
