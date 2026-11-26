import { Badge } from "@/components/ui/badge";
import SectionHeading, { Section } from "./SectionHeading";
import { experience } from "@/app/data/profile";
import { cn } from "@/lib/utils";

export default function Experience() {
  return (
    <Section id="experience">
      <SectionHeading eyebrow="Experience" title={<>Four teams, <span className="silver-text">all in production.</span></>} />
      <ol className="mt-12 border-l border-line">
        {experience.map((job) => (
          <li key={job.company + job.period} className="relative grid gap-2 py-7 pl-8 sm:grid-cols-[200px_1fr] sm:gap-8 sm:pl-10">
            <span aria-hidden className={cn("absolute top-9 -left-[5px] size-[9px] rounded-full", job.current ? "silver-fill" : "bg-line-strong")} />
            <p className="font-mono text-[13px] leading-6 text-muted-foreground">
              {job.period}
              {job.current && (
                <Badge variant="outline" className="ml-2 h-5 rounded-full border-silver/40 px-2 font-heading text-[10px] font-semibold tracking-[0.18em] text-silver">
                  NOW
                </Badge>
              )}
            </p>
            <div className="min-w-0">
              <h3 className="font-heading text-xl font-semibold tracking-tight">
                {job.role} <span className="text-muted-foreground">at</span>{" "}
                {job.url ? (
                  <a href={job.url} target="_blank" rel="noopener" className="underline decoration-line-strong underline-offset-[6px] transition-colors hover:decoration-silver">
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
              </h3>
              {job.companyNote && <p className="eyebrow mt-2">{job.companyNote}</p>}
              <p className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-muted-foreground">{job.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
