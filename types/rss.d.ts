declare module "rss" {
  interface RSSFeedOptions {
    title: string;
    description?: string;
    site_url?: string;
    feed_url?: string;
    language?: string;
    image_url?: string;
    image?: string;
    pubDate?: string | Date;
    link?: string;
    id?: string;
    feedLinks?: Record<string, string>;
    favicon?: string;
  }

  interface RSSItemCategory {
    name: string;
  }

  type RSSCategoryInput = string | RSSItemCategory;

  interface RSSItem {
    title: string;
    description?: string;
    url?: string;
    guid?: string;
    categories?: RSSCategoryInput[];
    category?: RSSCategoryInput[];
    author?: string | { name: string } | Array<string | { name: string }>;
    date?: string | Date;
    link?: string;
    id?: string;
  }

  class RSS {
    constructor(options: RSSFeedOptions);
    item(item: RSSItem): this;
    xml(options?: { indent?: boolean }): string;
    rss2(): string;
  }

  export = RSS;
}
