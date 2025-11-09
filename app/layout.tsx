import type { Metadata } from "next";
import "./globals.css";
import { buildMetadata } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";
import Script from "next/script";

export const runtime = "edge";
export const preferredRegion = "auto";

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-background/95">{children}</main>
            <Footer />
          </div>
          <Analytics />
        </ThemeProvider>
        <Script src="/pagefind/pagefind.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
