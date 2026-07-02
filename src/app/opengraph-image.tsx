import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

// Site-wide default social share card. File-based OG image — Next auto-wires og:image meta tags.
export const alt = `${profile.name} — SWE Undergrad @ SLIIT`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px",
          background: "#080d08",
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #0f140f 0%, #080d08 55%)",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#22c55e",
          }}
        >
          Portfolio
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#e8f5e8",
            marginTop: 12,
            lineHeight: 1.05,
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#8aad8a",
            marginTop: 24,
          }}
        >
          SWE Undergrad @ SLIIT · Full-Stack · AI &amp; DevOps
        </div>
      </div>
    ),
    { ...size }
  );
}
