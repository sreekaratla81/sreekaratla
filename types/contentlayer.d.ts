import type { MDX } from "contentlayer/core";

type Track = "tech" | "hospitality" | "conscious-leadership";

type RawDocumentData = {
  sourceFilePath: string;
  sourceFileName: string;
  sourceFileDir: string;
  flattenedPath: string;
};

export type Post = {
  _id: string;
  _raw: RawDocumentData;
  docType: "Post";
  type?: Track;
  title: string;
  excerpt?: string;
  summary: string;
  date: string;
  updated?: string;
  slug?: string;
  tags: string[];
  series?: string[];
  cover?: string;
  draft?: boolean;
  canonicalUrl?: string;
  pullQuotes?: string[];
  keyPoints?: string[];
  body: MDX;
  slug: string;
  url: string;
  readingTime: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  ogTitle: string;
  ogDescription: string;
};

export type DocumentTypes = Post;

export const allPosts: Post[];
export const allDocuments: DocumentTypes[];

export type DataExports = {
  allDocuments: DocumentTypes[];
  allPosts: Post[];
};
