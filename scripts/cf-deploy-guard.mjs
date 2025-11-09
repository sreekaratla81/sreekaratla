const isPages = !!(process.env.CF_PAGES || process.env.CF_PAGES_URL);
console.log(`[deploy] Cloudflare Pages guard. CF_PAGES=${String(isPages)}`);
console.log("[deploy] No Worker versions upload for Pages sites. Skipping.");
process.exit(0);
