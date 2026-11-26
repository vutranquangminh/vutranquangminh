import { Separator } from "@/components/ui/separator";
import { profile } from "@/app/data/profile";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
      <Separator className="bg-line" />
      <div className="flex flex-col items-start justify-between gap-6 pt-8 sm:flex-row sm:items-center">
        <div className="flex items-baseline gap-3">
          <span className="silver-text font-script text-3xl leading-none">{profile.nickname}</span>
          <span className="eyebrow">{profile.nameAscii}</span>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <li><a className="hover:text-foreground" href={profile.github} target="_blank" rel="noopener">GitHub</a></li>
          <li><a className="hover:text-foreground" href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a className="hover:text-foreground" href={`mailto:${profile.email}`}>Email</a></li>
        </ul>
      </div>
      <p className="mt-6 text-xs text-dim">© {new Date().getFullYear()} {profile.name}. Built with Next.js.</p>
    </footer>
  );
}
