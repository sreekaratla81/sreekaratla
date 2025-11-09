"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 text-sm">
      {siteConfig.navigation.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href as Route}
            className={cn(
              "transition hocus:text-accent",
              active ? "text-accent" : "text-foreground/70"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
