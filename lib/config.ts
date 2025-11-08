export type AnalyticsProvider = "plausible" | "ga4" | "none";

type NavLink = {
  title: string;
  href: string;
};

export const siteConfig = {
  name: process.env.SITE_NAME ?? "Sreekar Atla",
  tagline: process.env.SITE_TAGLINE ?? "Tech • Hospitality • Conscious Leadership",
  url: process.env.SITE_URL ?? "https://sreekaratla.com",
  description:
    "Insights across technology leadership, hospitality innovation, and conscious leadership by Sreekar Atla.",
  analyticsProvider: (process.env.ANALYTICS_PROVIDER as AnalyticsProvider) ?? "plausible",
  plausibleDomain: process.env.PLAUSIBLE_DOMAIN ?? "",
  ga4Id: process.env.GA4_ID ?? "",
  navigation: [
    { title: "Home", href: "/" },
    { title: "Writing", href: "/writing" },
    { title: "About", href: "/about" },
    { title: "Now", href: "/now" },
    { title: "Contact", href: "/contact" }
  ] satisfies NavLink[],
  social: {
    linkedin: "https://www.linkedin.com/in/sreekaratla",
    x: "https://x.com/sreekaratla",
    github: "https://github.com/sreekaratla"
  }
};

export type Track = "tech" | "hospitality" | "conscious-leadership";

export const trackLabels: Record<Track, string> = {
  tech: "Tech Insights",
  hospitality: "Hospitality & Travel",
  "conscious-leadership": "Conscious Leadership"
};

export const trackDescriptions: Record<Track, string> = {
  tech: "CTO perspectives on enterprise architecture, AI, and modern engineering.",
  hospitality: "Playbooks from hospitality operations, productization, and guest experience.",
  "conscious-leadership": "Spiritual essays on evolving from seeker to leader."
};
