import RSS from 'rss'
import { siteConfig, trackLabels, TrackId } from './config'
import { getAllPosts, getPostsByTrack } from './content'

const buildFeed = (title: string, description: string, posts = getAllPosts()) => {
  const feed = new RSS({
    title,
    description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: 'en',
    feedLinks: {
      rss2: `${siteConfig.url}/rss.xml`
    },
    image: `${siteConfig.url}/opengraph-image`,
    favicon: `${siteConfig.url}/favicon.ico`
  })

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      id: `${siteConfig.url}${post.url}`,
      link: `${siteConfig.url}${post.url}`,
      description: post.description,
      date: new Date(post.date),
      categories: post.tags?.map((tag) => ({ name: tag })),
      author: [{ name: 'Sreekar Atla' }]
    })
  })

  return feed
}

export const buildGlobalFeed = () =>
  buildFeed(
    `${siteConfig.name} — Articles`,
    'Technology, hospitality, leadership, and spirituality articles by Sreekar Atla.'
  ).xml({ indent: true })

export const buildTrackFeed = (track: TrackId) =>
  buildFeed(
    `${siteConfig.name} — ${trackLabels[track]}`,
    `${trackLabels[track]} articles from Sreekar Atla.`,
    getPostsByTrack(track)
  ).xml({ indent: true })
