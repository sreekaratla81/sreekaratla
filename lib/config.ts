export type AnalyticsProvider = 'plausible' | 'ga4' | 'none'

type NavLink = {
  title: string
  href: string
}

type SocialLinks = {
  linkedin: string
  github: string
  x?: string
}

export const TRACK_NAV: Array<NavLink & { id: 'tech' | 'hospitality' | 'leadership' | 'spirituality' }> = [
  { id: 'tech', title: 'Tech', href: '/tech' },
  { id: 'hospitality', title: 'Hospitality', href: '/hospitality' },
  { id: 'leadership', title: 'Leadership', href: '/leadership' },
  { id: 'spirituality', title: 'Spirituality', href: '/spirituality' }
]

export const siteConfig = {
  name: process.env.SITE_NAME ?? 'Sreekar Atla',
  tagline: 'Tech • Hospitality • Leadership • Spirituality',
  url: process.env.SITE_URL ?? 'https://sreekaratla.com',
  description:
    'Enterprise architect and hospitality operator sharing strategies in technology, guest experience, leadership, and spirituality.',
  analyticsProvider: (process.env.ANALYTICS_PROVIDER as AnalyticsProvider) ?? 'plausible',
  plausibleDomain: process.env.PLAUSIBLE_DOMAIN ?? '',
  ga4Id: process.env.GA4_ID ?? '',
  navigation: [
    { title: 'Home', href: '/' },
    ...TRACK_NAV,
    { title: 'About', href: '/about' },
    { title: 'Now', href: '/now' },
    { title: 'Contact', href: '/contact' }
  ] satisfies NavLink[],
  social: {
    linkedin: process.env.LINKEDIN_URL ?? 'https://www.linkedin.com/in/sreekaratla',
    github: process.env.GITHUB_URL ?? 'https://github.com/sreekaratla81',
    x: process.env.X_URL ?? 'https://x.com/sreekaratla'
  } satisfies SocialLinks,
  resumeUrl: process.env.RESUME_URL ?? '/Sreekar-Atla-Resume.pdf',
  hireMeUrl: process.env.HIRE_ME_URL ?? 'mailto:hello@sreekaratla.com'
}

export const trackLabels = {
  tech: 'Technology & AI',
  hospitality: 'Hospitality Ventures',
  leadership: 'Leadership Ops',
  spirituality: 'Spirituality in Practice'
} as const

type TrackDescription = {
  intro: string
  highlight: string
}

export const trackDescriptions: Record<keyof typeof trackLabels, TrackDescription> = {
  tech: {
    intro: 'Architecture patterns, AI roadmaps, and platform decisions for modern enterprises.',
    highlight: 'Focused on resilient systems, data platforms, and AI delivery.'
  },
  hospitality: {
    intro: 'Operator notes from Atlas Homestays on guest journeys, systems, and service design.',
    highlight: 'Operational rigor meets warm, trustworthy hosting.'
  },
  leadership: {
    intro: 'Structures and rituals for conscious leadership teams in high-growth environments.',
    highlight: 'Blending execution frameworks with mindful leadership.'
  },
  spirituality: {
    intro: 'Practical inner work for founders and executives rooted in Indian wisdom traditions.',
    highlight: 'Grounded practices to lead with clarity and compassion.'
  }
}

export type TrackId = keyof typeof trackLabels
