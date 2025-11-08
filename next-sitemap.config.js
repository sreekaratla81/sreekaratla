/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.SITE_URL
if (!siteUrl) {
  console.warn('[next-sitemap] SITE_URL not set; generating with placeholder, skipped in CI script.')
}

module.exports = {
  siteUrl: siteUrl || 'https://example.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 7000,
  transform: async (config, path) => ({
    loc: path,
    changefreq: 'weekly',
    priority: path === '/' ? 1.0 : 0.7,
    lastmod: new Date().toISOString()
  })
}
