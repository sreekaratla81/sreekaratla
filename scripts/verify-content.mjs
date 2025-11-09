import { readdir, readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import matter from "gray-matter";

const ROOT = new URL("..", import.meta.url).pathname;
const CONTENT_DIR = join(ROOT, "content");

const requiredStringFields = ["title", "date", "summary", "slug", "cover"];
const requiredBooleanFields = ["draft"];
const requiredListFields = ["tags"];
const optionalStringFields = ["canonicalUrl"];

async function collectMdxFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const resolved = join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectMdxFiles(resolved);
      }
      return extname(entry.name) === ".mdx" ? [resolved] : [];
    })
  );

  return files.flat();
}

function validateFrontMatter(file, data) {
  const errors = [];

  for (const field of requiredStringFields) {
    if (typeof data[field] !== "string" || data[field].trim() === "") {
      errors.push(`expected string field "${field}"`);
    }
  }

  for (const field of requiredBooleanFields) {
    if (typeof data[field] !== "boolean") {
      errors.push(`expected boolean field "${field}"`);
    }
  }

  for (const field of requiredListFields) {
    if (!Array.isArray(data[field]) || data[field].some((item) => typeof item !== "string" || item.trim() === "")) {
      errors.push(`expected string array field "${field}"`);
    }
  }

  for (const field of optionalStringFields) {
    if (field in data && typeof data[field] !== "string") {
      errors.push(`expected optional string field "${field}"`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`${file}: ${errors.join(", ")}`);
  }
}

async function main() {
  const files = await collectMdxFiles(CONTENT_DIR);
  const errors = [];

  await Promise.all(
    files.map(async (file) => {
      try {
        const source = await readFile(file, "utf8");
        const parsed = matter(source);
        validateFrontMatter(file, parsed.data);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    })
  );

  if (errors.length > 0) {
    console.error("\n[verify:content] Invalid front matter detected:\n");
    for (const error of errors) {
      console.error(` - ${error}`);
    }
    console.error("\nFix the issues above and rerun the build.\n");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[verify:content] Unexpected failure", error);
  process.exit(1);
});
