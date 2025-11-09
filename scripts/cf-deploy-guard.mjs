const isPages = Boolean(process.env.CF_PAGES || process.env.CF_PAGES_URL);

console.log(`[deploy] Cloudflare Pages guard invoked. CF_PAGES=${String(isPages)}`);

if (!isPages) {
  console.warn(
    "[deploy] Warning: guard script ran outside of Cloudflare Pages. Skip Wrangler deploys unless you have a Worker entry file."
  );
}

console.log("[deploy] Pages handles static publishing; skipping Wrangler deploy step.");

process.exit(0);
