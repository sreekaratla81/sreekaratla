import Link from "next/link";
import { cn } from "@/lib/utils";

export function TagBadge({ tag, className }: { tag: string; className?: string }) {
  return (
    <Link
      href={`/tags/${tag}`}
      className={cn(
        "inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground/80 transition hocus:border-accent hocus:text-accent",
        className
      )}
    >
      #{tag}
    </Link>
  );
}
