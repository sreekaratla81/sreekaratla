import { ImageResponse } from "next/og";
import { createElement } from "react";

export const runtime = "edge";

const containerStyle: Record<string, string | number> = {
  display: "flex",
  height: "100%",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#0F172A",
  color: "#F8FAFC",
  fontSize: 64,
  fontWeight: 700,
  letterSpacing: "0.02em",
  padding: "0 96px",
  textAlign: "center"
};

export function ogImage(params?: { title?: string }) {
  const title = params?.title?.trim() || "Sreekar Atla";

  return new ImageResponse(
    createElement(
      "div",
      { style: containerStyle },
      title.length > 120 ? `${title.slice(0, 117)}...` : title
    ),
    { width: 1200, height: 630 }
  );
}
