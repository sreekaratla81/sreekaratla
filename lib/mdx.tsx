import type { ComponentType } from "react";
import { Callout } from "@/components/callout";
import { PullQuote } from "@/components/pull-quote";
import { Figure } from "@/components/figure";

type MdxComponentMap = Record<string, ComponentType<any>>;

export const mdxComponents: MdxComponentMap = {
  Callout,
  PullQuote,
  Figure
};
