// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import readingTime from "reading-time";
var resolveSlug = (doc) => {
  if (doc.slug)
    return doc.slug;
  const fileName = doc._raw.sourceFileName ?? doc._raw.flattenedPath;
  return fileName.replace(/\.mdx$/, "");
};
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    type: {
      type: "enum",
      options: ["tech", "hospitality", "conscious-leadership"],
      required: true
    },
    title: { type: "string", required: true },
    excerpt: { type: "string", required: true },
    date: { type: "date", required: true },
    updated: { type: "date" },
    slug: { type: "string" },
    tags: { type: "list", of: { type: "string" }, required: true },
    series: { type: "string" },
    cover: { type: "string" },
    draft: { type: "boolean" },
    canonicalUrl: { type: "string" },
    pullQuotes: { type: "list", of: { type: "string" } }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => resolveSlug(doc)
    },
    url: {
      type: "string",
      resolve: (doc) => `/writing/${resolveSlug(doc)}`
    },
    readingTime: {
      type: "json",
      resolve: (doc) => readingTime(doc.body.raw)
    },
    ogTitle: {
      type: "string",
      resolve: (doc) => `${doc.title} \u2022 ${doc.type.replace(/-/g, " ")}`
    },
    ogDescription: {
      type: "string",
      resolve: (doc) => doc.excerpt
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  contentDirExclude: ["authors.json", "images"],
  documentTypes: [Post],
  fieldOptions: {
    typeFieldName: "docType"
  },
  disableImportAliasWarning: true,
  onUnknownDocuments: "skip-ignore",
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
  }
});
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-2M2V26ZY.mjs.map
