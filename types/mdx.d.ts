import type { ComponentType } from "react";

declare module "*.mdx" {
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
  export const frontmatter: Record<string, unknown>;
  export const toc: Array<{ title: string; slug: string }>;
}

declare module "mdx/types" {
  export type MDXComponents = {
    [key: string]: ComponentType<Record<string, unknown>>;
  };
}
