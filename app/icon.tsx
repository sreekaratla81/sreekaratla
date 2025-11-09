import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 128, height: 128 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 30% 30%, #38bdf8 0%, #0f172a 70%)",
          color: "#f8fafc",
          fontSize: 56,
          fontWeight: 700,
          letterSpacing: -1.5
        }}
      >
        SA
      </div>
    ),
    {
      ...size
    }
  );
}
