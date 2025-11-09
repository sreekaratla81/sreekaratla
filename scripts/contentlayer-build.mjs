import { spawnSync } from "node:child_process";

function run(cmd, args, env = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32", env: { ...process.env, ...env } });
  return r.status ?? (r.error ? 1 : 0);
}

function contentlayerBuild() {
  return run("npx", ["-y", "contentlayer@0.3.4", "build"], { FORCE_COLOR: "1" });
}

// 1st pass
let code = contentlayerBuild();

// If Contentlayer printed "Invalid markdown ... (Skipping documents)" previously, front-matter may have been broken.
// Run our fixer and retry once.
if (code !== 0) {
  const fix = run("node", ["scripts/fix-frontmatter.mjs"]);
  if (fix === 0) code = contentlayerBuild();
}

process.exitCode = code;
