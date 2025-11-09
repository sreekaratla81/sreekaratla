import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const repoRoot = process.cwd();
const contentDir = path.resolve(repoRoot, "content");

/** recursively collect .mdx files under content/ */
async function collectMdxFiles(dir) {
  const out = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) out.push(...await collectMdxFiles(p));
      else if (e.isFile() && p.toLowerCase().endsWith(".mdx")) out.push(p);
    }
  } catch (err) {
    // If content directory is missing, do not fail the build—just warn
    if (err.code === "ENOENT") {
      console.warn(`[verify:content] content dir not found: ${dir}`);
      return [];
    }
    throw err;
  }
  return out;
}

function normalizeYaml(obj) {
  // ensure arrays are arrays, coerce scalar types lightly
  if (typeof obj.tags === "string") obj.tags = [obj.tags];
  if (obj.tags && !Array.isArray(obj.tags)) obj.tags = [];
  if (typeof obj.draft !== "boolean") obj.draft = false;
  return obj;
}

async function main() {
  const files = await collectMdxFiles(contentDir);
  let errors = 0;

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    try {
      const gm = matter(raw, { language: "yaml", delimiters: "---" });
      const data = normalizeYaml(gm.data || {});
      // Basic required keys for our site
      const required = ["title", "date", "summary", "slug"];
      const missing = required.filter(k => !data[k]);
      if (missing.length) {
        console.error(`[verify:content] ${file}: missing front-matter keys: ${missing.join(", ")}`);
        errors++;
      }
    } catch (e) {
      console.error(`[verify:content] ${file}: invalid front-matter: ${e.message}`);
      errors++;
    }
  }

  if (errors > 0) {
    console.error(`[verify:content] ${errors} content issue(s) found`);
    process.exitCode = 1;
    return;
  }

  console.log(`[verify:content] OK (${files.length} files)`);
}

main().catch((e) => {
  console.error("[verify:content] Unexpected failure", e);
  process.exitCode = 1;
});
