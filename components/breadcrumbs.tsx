import Link from "next/link";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href as Route} className="text-foreground/70 transition hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground/50">{item.label}</span>
            )}
            {!isLast ? <ChevronRight className="h-3.5 w-3.5 text-foreground/40" /> : null}
          </span>
        );
      })}
    </nav>
  );
}
