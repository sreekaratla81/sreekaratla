import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import readingTime from 'reading-time'

type SlugSource = {
  _raw: { sourceFileName?: string; flattenedPath: string; sourceFilePath: string }
  slug?: string
  category: string
}

const TRACKS = ['tech', 'hospitality', 'leadership', 'spirituality'] as const

type Track = (typeof TRACKS)[number]

const normalizePath = (value?: string) => (value ?? '').replace(/\\+/g, '/')

const resolveSlug = <T extends SlugSource>(doc: T) => {
  if (doc.slug) return doc.slug
  const flattened = normalizePath(doc._raw.sourceFileName ?? doc._raw.flattenedPath)
  return flattened.replace(/\.mdx$/, '')
}

const resolveCategory = (doc: SlugSource): Track => {
  const folder = normalizePath(doc._raw.flattenedPath).split('/')[0]
  if (!folder || !TRACKS.includes(folder as Track)) {
    throw new Error(
      `[contentlayer] ${doc._raw.sourceFilePath} must live inside one of: ${TRACKS.join(', ')}`
    )
  }
  if (doc.category && doc.category !== folder) {
    throw new Error(
      `[contentlayer] category frontmatter (${doc.category}) must match folder (${folder}) for ${doc._raw.sourceFilePath}`
    )
  }
  return folder as Track
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    updated: { type: 'date' },
    draft: { type: 'boolean', default: false },
    tags: { type: 'list', of: { type: 'string' } },
    category: { type: 'enum', options: TRACKS as unknown as readonly string[], required: true },
    featured: { type: 'boolean' },
    hero: { type: 'string' }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => resolveSlug(doc)
    },
    url: {
      type: 'string',
      resolve: (doc) => `/${resolveCategory(doc)}/${resolveSlug(doc)}`
    },
    track: {
      type: 'string',
      resolve: (doc) => resolveCategory(doc)
    },
    readingTime: {
      type: 'json',
      resolve: (doc) => readingTime(doc.body.raw)
    }
  }
}))

export default makeSource({
  contentDirPath: 'content',
  contentDirExclude: ['authors.json', 'images'],
  documentTypes: [Post],
  fieldOptions: {
    typeFieldName: 'docType'
  },
  disableImportAliasWarning: true,
  onUnknownDocuments: 'skip-ignore',
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]
  }
})
