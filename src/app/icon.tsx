import { ImageResponse } from "next/og";

// Generated "AF" monogram favicon. Next auto-wires <link rel="icon">.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: -1,
          color: "#080d08",
          background: "#22c55e",
          borderRadius: 6,
        }}
      >
        AF
      </div>
    ),
    { ...size }
  );
}
