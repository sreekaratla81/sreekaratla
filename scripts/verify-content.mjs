import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"

const repoRoot = process.cwd()
const contentDir = path.resolve(repoRoot, "content")

const TRACKS = ["tech", "hospitality", "leadership", "spirituality"]

async function collectMdxFiles(dir) {
  const out = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const filePath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        out.push(...(await collectMdxFiles(filePath)))
      } else if (entry.isFile() && filePath.toLowerCase().endsWith('.mdx')) {
        out.push(filePath)
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`[verify:content] content dir not found: ${dir}`)
      return []
    }
    throw error
  }
  return out
}

function normalizeFrontmatter(data) {
  if (typeof data.tags === 'string') data.tags = [data.tags]
  if (data.tags && !Array.isArray(data.tags)) data.tags = []
  if (typeof data.draft !== 'boolean') data.draft = false
  return data
}

async function main() {
  const files = (await collectMdxFiles(contentDir)).sort((a, b) => a.localeCompare(b))
  let errors = 0

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8')
    try {
      const fm = matter(raw, { language: 'yaml', delimiters: '---' })
      const data = normalizeFrontmatter(fm.data || {})
      const required = ['title', 'description', 'date', 'category']
      const missing = required.filter((key) => !data[key])
      if (missing.length > 0) {
        console.error(
          `[verify:content] ${path.relative(repoRoot, file)} missing front-matter keys: ${missing.join(', ')}`
        )
        errors++
      }
      if (data.category && !TRACKS.includes(data.category)) {
        console.error(
          `[verify:content] ${path.relative(repoRoot, file)} invalid category '${data.category}'`
        )
        errors++
      }
    } catch (error) {
      console.error(`[verify:content] ${path.relative(repoRoot, file)} invalid front-matter: ${error.message}`)
      errors++
    }
  }

  if (errors > 0) {
    console.error(`[verify:content] ${errors} content issue(s) found`)
    process.exitCode = 1
    return
  }

  console.log(`[verify:content] OK (${files.length} files)`)
}

main().catch((error) => {
  console.error('[verify:content] Unexpected failure', error)
  process.exitCode = 1
})
