import type { ComputedFields } from "contentlayer/source-files";
import readingTime from "reading-time";

const getSlug = (doc: any) => {
  if (doc.slug) return doc.slug;
  const fileName: string = doc._raw.sourceFileName ?? doc._raw.flattenedPath;
  return fileName.replace(/\.mdx$/, "");
};

export const computedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => getSlug(doc)
  },
  url: {
    type: "string",
    resolve: (doc) => `/writing/${getSlug(doc)}`
  },
  readingTime: {
    type: "json",
    resolve: (doc) => readingTime(doc.body.raw)
  },
  ogTitle: {
    type: "string",
    resolve: (doc) => `${doc.title} • ${doc.type.replace(/-/g, " ")}`
  },
  ogDescription: {
    type: "string",
    resolve: (doc) => doc.excerpt
  }
};
