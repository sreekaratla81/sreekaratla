import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import readingTime from 'reading-time'

type SlugSource = {
  _raw: { sourceFileName?: string; flattenedPath: string }
  slug?: string
}

const resolveSlug = <T extends SlugSource>(doc: T) => {
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
      options: ['tech', 'hospitality', 'conscious-leadership']
    },
    title: { type: 'string', required: true },
    excerpt: { type: 'string' },
    summary: { type: 'string', required: true },
    date: { type: 'date', required: true },
    updated: { type: 'date' },
    slug: { type: 'string' },
    tags: { type: 'list', of: { type: 'string' }, required: true },
    series: { type: 'list', of: { type: 'string' } },
    cover: { type: 'string' },
    draft: { type: 'boolean' },
    canonicalUrl: { type: 'string' },
    pullQuotes: { type: 'list', of: { type: 'string' } },
    keyPoints: { type: 'list', of: { type: 'string' } }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => resolveSlug(doc)
    },
    url: {
      type: 'string',
      resolve: (doc) => `/writing/${resolveSlug(doc)}`
    },
    readingTime: {
      type: 'json',
      resolve: (doc) => readingTime(doc.body.raw)
    },
    ogTitle: {
      type: 'string',
      resolve: (doc) => {
        const flattened = doc._raw.flattenedPath ?? ''
        const inferred = flattened.split('/')[0] || 'post'
        const type = doc.type ?? inferred
        return `${doc.title} • ${type.replace(/-/g, ' ')}`
      }
    },
    ogDescription: {
      type: 'string',
      resolve: (doc) => doc.summary ?? doc.excerpt
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
