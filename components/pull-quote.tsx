import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PullQuote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <blockquote className={cn("my-8 border-l-4 border-accent/80 pl-6 text-xl font-serif italic text-foreground/90", className)}>
      {children}
    </blockquote>
  );
}
