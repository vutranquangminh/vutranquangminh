export default function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: React.ReactNode; intro?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-heading text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">{title}</h2>
      {intro && <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}

/** Wrapper for below-the-fold sections: the browser skips their layout/paint until they are near. */
export function Section({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-5 py-20 [contain-intrinsic-size:auto_900px] [content-visibility:auto] sm:px-8 lg:py-24 ${className ?? ""}`}>
      {children}
    </section>
  );
}
