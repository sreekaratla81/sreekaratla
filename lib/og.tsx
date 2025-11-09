import { ImageResponse } from "next/og";

export const runtime = "edge";

export function ogImage(params?: { title?: string }) {
  const title = params?.title ?? "Sreekar Atla";
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          fontWeight: 700
        }}
      >
        {title}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
