import { spawnSync } from "node:child_process";

function run(cmd, args, env = {}) {
  const isWindows = process.platform === "win32";
  const r = spawnSync(cmd, args, {
    stdio: isWindows ? "pipe" : "inherit",
    shell: isWindows,
    env: { ...process.env, ...env },
    encoding: isWindows ? "utf8" : undefined,
  });

  let code = r.status ?? (r.error ? 1 : 0);

  if (!isWindows) return code;

  const stdout = typeof r.stdout === "string" ? r.stdout : r.stdout?.toString() ?? "";
  const stderr = typeof r.stderr === "string" ? r.stderr : r.stderr?.toString() ?? "";
  const combined = `${stdout}${stderr}`;
  const clipanionBugMessage = "The \"code\" argument must be of type number. Received an instance of Object";
  const isClipanionBug =
    code !== 0 && combined.includes("ERR_INVALID_ARG_TYPE") && combined.includes(clipanionBugMessage);

  if (stdout) process.stdout.write(stdout);
  if (stderr && !isClipanionBug) process.stderr.write(stderr);

  // Windows workaround for Contentlayer 0.3.4 / Clipanion 3.2.1 emitting ERR_INVALID_ARG_TYPE.
  if (isClipanionBug) {
    code = 0;
    process.stderr.write(
      "Detected known Clipanion Windows bug; contentlayer build completed successfully.\n",
    );
  }

  return code;
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
