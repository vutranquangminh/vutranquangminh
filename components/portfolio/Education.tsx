import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SectionHeading, { Section } from "./SectionHeading";
import { activities, certifications, education, publication } from "@/app/data/profile";

const linkClass = "text-foreground underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-silver";

export default function Education() {
  return (
    <Section id="education">
      <SectionHeading eyebrow="Education & recognition" title={<>Still <span className="silver-text">studying</span> the craft.</>} />

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {education.map((e) => (
          <article key={e.school} className="panel rounded-3xl p-6 sm:p-8">
            <p className="font-mono text-[13px] text-muted-foreground">{e.period}</p>
            <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight">{e.degree}</h3>
            <p className="mt-1 text-[15px] text-muted-foreground">{e.school}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {e.grade && <Badge className="h-7 rounded-full bg-panel-2 px-3 font-heading text-[13px] font-semibold text-silver ring-1 ring-line">{e.grade}</Badge>}
              {e.notes.map((n) => (
                <Badge key={n} variant="secondary" className="h-auto min-h-7 rounded-full px-3 py-1 text-[13px] font-normal whitespace-normal text-foreground/90 ring-1 ring-line">
                  {n}
                </Badge>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <article className="panel rounded-3xl p-6 sm:p-8">
          <p className="eyebrow">Publication</p>
          <h3 className="mt-4 font-heading text-lg leading-snug font-semibold tracking-tight">
            <a href={publication.url} target="_blank" rel="noopener" className="hover:text-silver">
              {publication.title} <ArrowUpRightIcon aria-hidden className="inline size-4 text-muted-foreground" />
            </a>
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">{publication.venue} · {publication.date}</p>

          <Separator className="my-8 bg-line" />

          <p className="eyebrow">Activities & volunteering</p>
          <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
            {activities.map((a) => (
              <li key={a.link.url}>
                {a.text} <a href={a.link.url} target="_blank" rel="noopener" className={linkClass}>{a.link.label}</a>
                {a.after && <> and <a href={a.after.url} target="_blank" rel="noopener" className={linkClass}>{a.after.label}</a></>}.
              </li>
            ))}
          </ul>
        </article>

        <article className="panel rounded-3xl p-6 sm:p-8">
          <p className="eyebrow">Certifications & languages</p>
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
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener" className="group flex items-center justify-between gap-4">
                      {body}
                      <ArrowUpRightIcon aria-hidden className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        </article>
      </div>
    </Section>
  );
}
