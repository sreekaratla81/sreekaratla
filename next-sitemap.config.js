/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://sreekaratla.com",
  generateRobotsTxt: true,
  outDir: "public",
};
