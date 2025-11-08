import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const toneStyles: Record<string, string> = {
  info: "border-sky-400/60 bg-sky-400/10 text-sky-800 dark:text-sky-100",
  warn: "border-amber-400/60 bg-amber-400/10 text-amber-800 dark:text-amber-100",
  success: "border-emerald-400/60 bg-emerald-400/10 text-emerald-800 dark:text-emerald-100"
};

export function Callout({ type = "info", children }: { type?: "info" | "warn" | "success"; children: ReactNode }) {
  return (
    <div className={cn("my-6 rounded-2xl border px-4 py-3 text-sm", toneStyles[type])}>
      {children}
    </div>
  );
}
