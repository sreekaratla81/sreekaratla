const hasPagesFlag = process.env.CF_PAGES === "1";
const hasPagesUrl =
  process.env.CI === "true" && typeof process.env.CF_PAGES_URL === "string" && process.env.CF_PAGES_URL.length > 0;
const isCfPages = hasPagesFlag || hasPagesUrl;

if (isCfPages) {
  console.log("[cf-deploy-guard] Cloudflare Pages build detected; deploy handled by Pages. Skipping custom deploy step.");
  process.exit(0);
}

if (process.env.CI === "true") {
  console.log("[cf-deploy-guard] CI environment without Cloudflare Pages context; nothing to deploy.");
} else {
  console.log("[cf-deploy-guard] Local environment; deploy script is a no-op.");
}

process.exit(0);
