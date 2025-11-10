import { compareDesc } from 'date-fns'
import { allPosts, Post } from 'contentlayer/generated'

export const TRACKS = ['tech', 'hospitality', 'leadership', 'spirituality'] as const

export type Track = (typeof TRACKS)[number]

type Options = { includeDrafts?: boolean }

const normalizePath = (value?: string) => (value ?? '').replace(/\\+/g, '/')

const resolveTrack = (post: Post): Track => {
  const fromComputed = post.track as Track | undefined
  if (fromComputed && (TRACKS as readonly string[]).includes(fromComputed)) {
    return fromComputed
  }

  const flattened = normalizePath(post._raw.flattenedPath).split('/')[0]
  if ((TRACKS as readonly string[]).includes(flattened)) {
    return flattened as Track
  }

  throw new Error(`Unable to resolve track for ${post._id}`)
}

const isPublished = (post: Post) => {
  const publishedDate = new Date(post.date)
  const now = new Date()
  return !post.draft && publishedDate.getTime() <= now.getTime()
}

const filterVisibility = (post: Post, includeDrafts: boolean) => {
  if (includeDrafts) return true
  return isPublished(post)
}

export const getAllPosts = ({ includeDrafts = false }: Options = {}) =>
  allPosts
    .filter((post) => filterVisibility(post, includeDrafts))
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

type TrackOptions = Options & { track?: Track }

export const getPostsByTrack = (track: Track, options?: Options) =>
  getAllPosts(options).filter((post) => resolveTrack(post) === track)

export const getPostByParams = (
  category: string,
  slug: string,
  { includeDrafts = false }: Options = {}
) =>
  getAllPosts({ includeDrafts }).find(
    (post) => resolveTrack(post) === category && post.slug === slug
  )

export const getPostBySlug = (slug: string, options?: Options) =>
  getAllPosts(options).find((post) => post.slug === slug)

export const getPostsByTag = (tag: string, { includeDrafts = false, track }: TrackOptions = {}) =>
  getAllPosts({ includeDrafts }).filter((post) => {
    const matchesTag = post.tags?.includes(tag)
    const matchesTrack = track ? resolveTrack(post) === track : true
    return Boolean(matchesTag) && matchesTrack
  })

export const getTags = ({ includeDrafts = false, track }: TrackOptions = {}) => {
  const tagSet = new Set<string>()
  getAllPosts({ includeDrafts }).forEach((post) => {
    if (track && resolveTrack(post) !== track) return
    post.tags?.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
}

export const getFeaturedPosts = ({ includeDrafts = false, track }: TrackOptions = {}) =>
  getAllPosts({ includeDrafts }).filter((post) => {
    if (!post.featured) return false
    if (track) return resolveTrack(post) === track
    return true
  })

export const getAdjacentPosts = (current: Post, { includeDrafts = false }: Options = {}) => {
  const track = resolveTrack(current)
  const posts = getPostsByTrack(track, { includeDrafts })
  const index = posts.findIndex((post) => post._id === current._id)
  return {
    previous: index < posts.length - 1 ? posts[index + 1] : undefined,
    next: index > 0 ? posts[index - 1] : undefined
  }
}

export const getRelatedPosts = (current: Post, limit = 3, options?: Options) => {
  const tags = new Set(current.tags ?? [])
  if (tags.size === 0) return []

  return getPostsByTrack(resolveTrack(current), options)
    .filter((post) => post._id !== current._id)
    .map((post) => ({
      post,
      score: post.tags?.reduce((acc, tag) => acc + (tags.has(tag) ? 1 : 0), 0) ?? 0
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.post)
}

export const isDraftPost = (post: Post) => post.draft ?? false

export const isFutureDated = (post: Post) => new Date(post.date).getTime() > Date.now()

export { resolveTrack }
