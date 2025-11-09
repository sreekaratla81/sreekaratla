import { ImageResponse } from "@vercel/og";
import { siteConfig } from "./config";

export const runtime = "edge";

const interBold = fetch(
  new URL("https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTcviYwY.woff2"),
  {
    cache: "force-cache"
  }
).then((res) => res.arrayBuffer());

export const createOgImage = async (title: string, description: string) => {
  const fontData = await interBold;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          padding: "80px"
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7 }}>{siteConfig.tagline}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1 style={{ fontSize: 60, lineHeight: 1.1 }}>{title}</h1>
          <p style={{ fontSize: 28, opacity: 0.85 }}>{description}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 24, letterSpacing: 2 }}>{siteConfig.name}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
          weight: 700
        }
      ]
    }
  );
};
