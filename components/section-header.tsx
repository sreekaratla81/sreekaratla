import { cn } from "@/lib/utils";
import type { TrackId } from "@/lib/config";

const accentMap: Record<TrackId | "brand", string> = {
  brand: "text-accent",
  tech: "text-tech",
  hospitality: "text-hospitality",
  leadership: "text-leadership",
  spirituality: "text-spirituality"
};

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  accent?: TrackId | "brand";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  accent = "brand",
  className
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {eyebrow ? (
        <span className={cn("text-xs font-semibold uppercase tracking-[0.18em]", accentMap[accent])}>
          {eyebrow}
        </span>
      ) : null}
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
        {description ? <p className="text-base text-foreground/70">{description}</p> : null}
      </div>
    </div>
  );
}
