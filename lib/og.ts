import { createElement } from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";

const size = { width: 1200, height: 630 };

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    gap: 32,
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "#f8fafc",
    padding: "96px"
  },
  title: {
    fontSize: 64,
    fontWeight: 700,
    lineHeight: 1.1
  },
  description: {
    fontSize: 32,
    color: "rgba(241, 245, 249, 0.85)"
  },
  footer: {
    fontSize: 24,
    letterSpacing: 3,
    textTransform: "uppercase" as const,
    opacity: 0.7
  }
};

type CreateOgImageOptions = {
  title: string;
  description?: string;
  footer?: string;
};

export function createOgImage({
  title,
  description = "",
  footer
}: CreateOgImageOptions) {
  const children = [
    createElement("div", { key: "title", style: styles.title }, title)
  ];

  if (description) {
    children.push(
      createElement("div", { key: "description", style: styles.description }, description)
    );
  }

  if (footer) {
    children.push(createElement("div", { key: "footer", style: styles.footer }, footer));
  }

  return new ImageResponse(
    createElement("div", { style: styles.container }, children),
    {
      ...size
    }
  );
}

export { size };
