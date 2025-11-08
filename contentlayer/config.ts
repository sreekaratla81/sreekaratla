import { defineDocumentType, makeSource } from "@contentlayer2/source-files";
import { computedFields } from "./fields";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const Post = defineDocumentType(() => ({
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
  computedFields
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
  }
});
