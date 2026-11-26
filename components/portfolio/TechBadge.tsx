import { Badge } from "@/components/ui/badge";

export default function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="outline" className="h-7 rounded-full border-line bg-[#111113] px-2.5 font-mono text-xs font-normal text-[#c4c4c9]">
      {children}
    </Badge>
  );
}
