"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";

const buildShareUrl = (path: string) => `${siteConfig.url}${path}`;

export function ShareButtons({ title }: { title: string }) {
  const pathname = usePathname();
  const url = buildShareUrl(pathname ?? "/");

  const shareLinks = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — ${url}`)}`
    }
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-2 text-sm text-foreground/70">
        <Share2 className="h-4 w-4" /> Share
      </span>
      {shareLinks.map((link) => (
        <Button asChild key={link.label} variant="outline" className="text-xs">
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        </Button>
      ))}
    </div>
  );
}
