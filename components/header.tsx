import Link from "next/link";
import Image from "next/image";
import { Container } from "./container";
import { Nav } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { Search } from "./search";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logos/wordmark.svg" alt="Sreekar Atla" width={160} height={32} priority />
          </Link>
          <div className="hidden md:block">
            <Nav />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Search />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
