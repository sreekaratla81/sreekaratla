import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("prose prose-slate dark:prose-invert", className)}>{children}</div>;
}
