"use client";

import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PagefindResult {
  id: string;
  data: {
    url: string;
    meta: Record<string, string>;
    excerpt: string;
  };
}

declare global {
  interface Window {
    pagefind?: {
      init: (opts: { baseUrl?: string }) => Promise<{ search: (query: string) => Promise<{ results: PagefindResult[] }> }>;
    };
  }
}

export function Search() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pagefindRef = useRef<null | ((query: string) => Promise<{ results: PagefindResult[] }>)>(null);

  useEffect(() => {
    const loadPagefind = async () => {
      if (pagefindRef.current || typeof window === "undefined") return;
      try {
        setLoading(true);
        const pagefind = await window.pagefind?.init({ baseUrl: "/pagefind" });
        if (pagefind) {
          pagefindRef.current = pagefind.search;
        }
      } catch (error) {
        console.error("Failed to load Pagefind", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadPagefind().catch(() => undefined);
    }
  }, [open]);

  const handleSearch = async (query: string) => {
    if (!pagefindRef.current || !query) {
      setResults([]);
      return;
    }
    const searchResults = await pagefindRef.current(query);
    setResults(searchResults.results.slice(0, 5));
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-foreground/70 hocus:text-accent"
        onClick={() => {
          setOpen((prev) => !prev);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        aria-label="Search"
      >
        <SearchIcon className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-border/60 bg-background p-4 shadow-xl">
          <div className="flex items-center gap-2 rounded-full border border-border/60 px-3">
            <SearchIcon className="h-4 w-4 text-foreground/50" />
            <input
              ref={inputRef}
              type="search"
              placeholder={loading ? "Loading index…" : "Search writing"}
              className="w-full bg-transparent py-2 text-sm outline-none"
              onChange={(event) => handleSearch(event.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mt-3 space-y-3">
            {results.length === 0 && <p className="text-xs text-foreground/60">{loading ? "Preparing index…" : "Try a keyword like AI or hospitality."}</p>}
            {results.map((result) => (
              <a
                key={result.id}
                href={result.data.url}
                className={cn(
                  "block rounded-xl border border-transparent p-3 text-sm transition hocus:border-accent hocus:bg-muted"
                )}
              >
                <p className="font-semibold">{result.data.meta.title ?? result.data.url}</p>
                <p className="text-xs text-foreground/60">{result.data.excerpt}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
