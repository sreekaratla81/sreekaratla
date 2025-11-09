import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const repo = process.cwd();
const contentDir = path.resolve(repo, "content");
const LIST_KEYS = new Set(["tags", "keyPoints", "series"]);

const ZW = /[\u200B-\u200D\uFEFF]/g;
const SMART = /[\u2018\u2019\u201C\u201D]/g;
const smartMap = { "\u2018": "'", "\u2019": "'", "\u201C": '"', "\u201D": '"' };

async function* walk(dir) {
  let ents;
  try { ents = await fs.readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && p.toLowerCase().endsWith(".mdx")) yield p;
  }
}

function normalizeLists(data) {
  for (const key of Object.keys(data)) {
    if (LIST_KEYS.has(key)) {
      const v = data[key];
      if (v == null) { data[key] = []; continue; }
      if (Array.isArray(v)) {
        data[key] = v.map(x => (x == null ? "" : String(x))).filter(Boolean);
      } else if (typeof v === "string") {
        // split on ; or | or newline or comma if clearly multi-valued, else single item
        const parts = v.includes("\n")
          ? v.split("\n")
          : /[;|,]/.test(v) ? v.split(/[;|,]/) : [v];
        data[key] = parts.map(s => s.trim()).filter(Boolean);
      } else {
        data[key] = [];
      }
    }
  }
  return data;
}

function quoteScalars(data) {
  for (const k of Object.keys(data)) {
    const v = data[k];
    if (typeof v === "string") data[k] = v.replace(ZW, "").replace(SMART, m => smartMap[m]);
    if (Array.isArray(v)) data[k] = v.map(x => typeof x === "string" ? x.replace(ZW,"").replace(SMART,m=>smartMap[m]) : x);
  }
  return data;
}

function ensureRequired(data) {
  if (typeof data.draft !== "boolean") data.draft = false;
  return data;
}

async function fixFile(file) {
  let raw = await fs.readFile(file, "utf8");
  const original = raw;
  raw = raw.replace(ZW, ""); // strip zero-width
  raw = raw.replace(SMART, m => smartMap[m]); // normalize quotes

  // Ensure we have a closing front-matter fence
  const hasFM = raw.startsWith("---");
  if (hasFM) {
    const secondFence = raw.indexOf("\n---", 3);
    if (secondFence === -1) {
      // try to auto close before first non-front-matter markdown heading
      const firstBody = raw.indexOf("\n#");
      if (firstBody !== -1) raw = raw.slice(0, firstBody) + "\n---\n" + raw.slice(firstBody + 1);
      else raw = raw + "\n---\n";
    }
  }

  // Parse with gray-matter; if it fails, try a best-effort recovery by wrapping unquoted lines
  let fm;
  try {
    fm = matter(raw, { language: "yaml", delimiters: "---" });
  } catch {
    // naive fallback: wrap colon-containing lines in quotes
    raw = raw.replace(/^([A-Za-z0-9_-]+):\s*(.+)$/gm, (_, k, v) => {
      if (v.startsWith('"') || v.startsWith("'") || v.startsWith("[")) return `${k}: ${v}`;
      return `${k}: "${v.replace(/"/g, '\\"')}"`;
    });
    fm = matter(raw, { language: "yaml", delimiters: "---" });
  }

  fm.data = ensureRequired(quoteScalars(normalizeLists(fm.data || {})));

  // Re-stringify clean YAML
  const out = matter.stringify(fm.content.trimStart(), fm.data, { language: "yaml", delimiters: "---" });

  if (out !== original) {
    await fs.writeFile(file, out, "utf8");
    return true;
  }
  return false;
}

async function main() {
  let changed = 0, total = 0;
  for await (const file of walk(contentDir)) {
    total++;
    try { if (await fixFile(file)) changed++; }
    catch (e) { console.error(`[fix:frontmatter] ${file}: ${e.message}`); }
  }
  console.log(`[fix:frontmatter] scanned ${total} file(s); changed ${changed}`);
}

main().catch(e => { console.error("[fix:frontmatter] fatal", e); process.exitCode = 1; });
