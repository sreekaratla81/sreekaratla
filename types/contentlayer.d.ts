import type { MDX } from 'contentlayer/core'

type Track = 'tech' | 'hospitality' | 'leadership' | 'spirituality'

type RawDocumentData = {
  sourceFilePath: string
  sourceFileName: string
  sourceFileDir: string
  flattenedPath: string
}

export type Post = {
  _id: string
  _raw: RawDocumentData
  docType: 'Post'
  title: string
  description: string
  date: string
  updated?: string
  draft?: boolean
  tags?: string[]
  category: Track
  featured?: boolean
  hero?: string
  body: MDX
  slug: string
  url: string
  track: Track
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
}

export type DocumentTypes = Post

export const allPosts: Post[]
export const allDocuments: DocumentTypes[]

export type DataExports = {
  allDocuments: DocumentTypes[]
  allPosts: Post[]
}
