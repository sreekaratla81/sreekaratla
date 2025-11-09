import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import readingTime from 'reading-time'

type Track = 'tech' | 'hospitality' | 'conscious-leadership'

type RawDoc = {
  _raw: { sourceFileName?: string; flattenedPath: string }
  slug?: string
  body: { raw: string }
}

const resolveSlug = (doc: RawDoc) => {
  if (doc.slug) return doc.slug
  const fileName = doc._raw.sourceFileName ?? doc._raw.flattenedPath
  return fileName.replace(/\.mdx$/, '')
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    type: {
      type: 'enum',
      options: ['tech', 'hospitality', 'conscious-leadership'],
      required: true
    },
    title: { type: 'string', required: true },
    excerpt: { type: 'string', required: true },
    date: { type: 'date', required: true },
    updated: { type: 'date' },
    slug: { type: 'string' },
    tags: { type: 'list', of: { type: 'string' }, required: true },
    series: { type: 'string' },
    cover: { type: 'string' },
    draft: { type: 'boolean' },
    canonicalUrl: { type: 'string' },
    pullQuotes: { type: 'list', of: { type: 'string' } }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc: RawDoc) => resolveSlug(doc)
    },
    url: {
      type: 'string',
      resolve: (doc: RawDoc & { type: Track }) => `/writing/${resolveSlug(doc)}`
    },
    readingTime: {
      type: 'json',
      resolve: (doc: RawDoc) => readingTime(doc.body.raw)
    },
    ogTitle: {
      type: 'string',
      resolve: (doc: RawDoc & { title: string; type: Track }) => `${doc.title} • ${doc.type.replace(/-/g, ' ')}`
    },
    ogDescription: {
      type: 'string',
      resolve: (doc: RawDoc & { excerpt: string }) => doc.excerpt
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
