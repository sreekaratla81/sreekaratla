import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const repoRoot = process.cwd();
const contentDir = path.resolve(repoRoot, "content");

async function collectMdxFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch((error) => {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  });

  const results = [];
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectMdxFiles(filePath)));
    } else if (entry.isFile() && filePath.toLowerCase().endsWith(".mdx")) {
      results.push(filePath);
    }
  }
  return results;
}

function convertQuotedLinesToArray(frontMatter) {
  return frontMatter.replace(
    /^(?<indent>\s*)(?<key>[A-Za-z0-9_-]+):(\s*)\n(?<block>(?:\k<indent>\s*"[^"\n]+"[ \t]*\n?)+)/gm,
    (_, indent, key, spacing, block) => {
      const normalizedValues = block
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.replace(/^"|"$/g, ""));
      const valueIndent = `${indent}  `;
      const formatted = normalizedValues.map((value) => `${valueIndent}- ${value}`).join("\n");
      return `${indent}${key}:${spacing}\n${formatted}\n`;
    }
  );
}

function normalizeLineEndings(text) {
  return text.replace(/\r\n/g, "\n");
}

function ensureClosingDelimiter(text) {
  if (!text.startsWith("---")) {
    return text;
  }

  if (/^---\n[\s\S]*?\n---(\n|$)/.test(text)) {
    return text;
  }

  const lines = text.split("\n");
  let insertionIndex = lines.length;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === "") {
      insertionIndex = i;
      break;
    }
    if (!/^\s*[^:#]+\s*:/.test(line) && !/^\s*-/.test(line)) {
      insertionIndex = i;
      break;
    }
  }

  lines.splice(insertionIndex, 0, "---");
  return lines.join("\n");
}

function trimTrailingWhitespace(text) {
  return text.replace(/[ \t]+\n/g, "\n");
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[,\n]/)
      .map((item) => item.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
  }

  if (value == null) {
    return [];
  }

  return [String(value).trim()].filter(Boolean);
}

function normalizeDraft(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "yes" || normalized === "1") {
      return true;
    }
    if (normalized === "false" || normalized === "no" || normalized === "0") {
      return false;
    }
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return Boolean(value);
}

function rebuildFrontMatter(content, data) {
  const orderedData = {};
  for (const key of Object.keys(data || {})) {
    if (key === "tags") {
      orderedData[key] = normalizeTags(data[key]);
    } else if (key === "draft") {
      orderedData[key] = normalizeDraft(data[key]);
    } else {
      orderedData[key] = data[key];
    }
  }

  if (Object.prototype.hasOwnProperty.call(data || {}, "draft")) {
    orderedData.draft = normalizeDraft(orderedData.draft);
  }

  return matter.stringify(content, orderedData, { delimiters: "---" });
}

async function repairFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const useCRLF = /\r\n/.test(raw);
  let normalized = normalizeLineEndings(raw);

  if (!normalized.startsWith("---")) {
    return false;
  }

  normalized = ensureClosingDelimiter(normalized);

  const closingIndex = normalized.indexOf("\n---", 3);
  if (closingIndex === -1) {
    return false;
  }

  const frontMatter = normalized.slice(4, closingIndex);
  const bodyStart = closingIndex + "\n---".length;
  const body = normalized.slice(bodyStart).replace(/^\n/, "");

  const sanitizedFrontMatter = trimTrailingWhitespace(convertQuotedLinesToArray(frontMatter));
  const sanitizedDocument = `---\n${sanitizedFrontMatter.trim()}\n---\n${body}`;

  let parsed;
  try {
    parsed = matter(sanitizedDocument, { language: "yaml", delimiters: "---" });
  } catch (error) {
    console.warn(`[fix:frontmatter] ${path.relative(repoRoot, filePath)}: unable to parse after normalization (${error.message})`);
    return false;
  }

  const normalizedBody = trimTrailingWhitespace(parsed.content);
  const rebuilt = rebuildFrontMatter(`${normalizedBody}${normalizedBody.endsWith("\n") ? "" : "\n"}`, parsed.data);
  const finalContent = useCRLF ? rebuilt.replace(/\n/g, "\r\n") : rebuilt;

  if (finalContent !== raw) {
    await fs.writeFile(filePath, finalContent);
    console.log(`[fix:frontmatter] repaired ${path.relative(repoRoot, filePath)}`);
    return true;
  }

  return false;
}

async function main() {
  const files = await collectMdxFiles(contentDir);
  if (files.length === 0) {
    return;
  }

  let repaired = 0;
  for (const file of files) {
    const changed = await repairFile(file);
    if (changed) {
      repaired++;
    }
  }

  if (repaired > 0) {
    console.log(`[fix:frontmatter] updated ${repaired} file(s)`);
  } else {
    console.log("[fix:frontmatter] no changes required");
  }
}

main().catch((error) => {
  console.error("[fix:frontmatter] Unexpected failure", error);
  process.exitCode = 1;
});
