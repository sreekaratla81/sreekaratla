/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://sreekaratla.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 7000,
  transform: async (config, path) => ({
    loc: path,
    changefreq: 'weekly',
    priority: path === '/' ? 1.0 : 0.7,
    lastmod: new Date().toISOString()
  })
};
