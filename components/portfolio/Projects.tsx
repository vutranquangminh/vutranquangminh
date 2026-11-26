import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import SectionHeading, { Section } from "./SectionHeading";
import TechBadge from "./TechBadge";
import { projects, type Project } from "@/app/data/profile";
import { cn } from "@/lib/utils";

function ProjectCard({ project, featured }: { project: Project; featured: boolean }) {
  return (
    <article className={cn("panel flex flex-col rounded-3xl p-6 sm:p-8", featured && "lg:col-span-2")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{project.context} · {project.period}</p>
          <h3 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-[28px]">{project.name}</h3>
        </div>
        {project.metric && (
          <div className="text-right">
            <p className="silver-text font-heading text-3xl font-light tracking-tight">{project.metric.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{project.metric.label}</p>
          </div>
        )}
      </div>

      <p className="mt-5 max-w-[70ch] text-base leading-relaxed text-foreground/90">{project.headline}</p>

      <ul className={cn("mt-5 grid gap-3", featured && "lg:grid-cols-3")}>
        {project.points.map((point) => (
          <li key={point} className="flex gap-3 text-[14.5px] leading-relaxed text-muted-foreground">
            <span aria-hidden className="mt-[9px] size-1.5 flex-none rotate-45 bg-silver/70" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
        <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
          {project.stack.map((t) => (
            <li key={t}><TechBadge>{t}</TechBadge></li>
          ))}
        </ul>
        {project.url && (
          <Button asChild variant="link" className="h-auto p-0 font-heading font-semibold text-silver">
            <a href={project.url} target="_blank" rel="noopener">
              Visit <ArrowUpRightIcon weight="bold" />
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Selected work"
        title={<>Systems people <span className="silver-text">pay, heal and learn</span> with.</>}
        intro="Production work from four teams and one platform build: payments that reconcile, AI that streams, and interfaces that hold 60fps."
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.name} project={p} featured={i === 0} />
        ))}
      </div>
    </Section>
  );
}
