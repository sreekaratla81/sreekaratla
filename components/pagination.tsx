import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | number | undefined>;
}

const buildHref = (basePath: string, page: number, query?: Record<string, string | number | undefined>) => {
  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    });
  }
  params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
};

export function Pagination({ currentPage, totalPages, basePath, query }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-6">
      {currentPage > 1 ? (
        <Button asChild variant="outline">
          <Link href={buildHref(basePath, currentPage - 1, query)}>Newer</Link>
        </Button>
      ) : (
        <span />
      )}

      <span className="text-sm text-foreground/70">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Button asChild variant="outline">
          <Link href={buildHref(basePath, currentPage + 1, query)}>Older</Link>
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}
