import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

// Per-project social share card, stamped with the project title.
export const alt = "Project — Amzal Foumi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-generate a card for every project (mirrors generateStaticParams on the page).
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const title = project?.title ?? profile.name;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#080d08",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #0f140f 0%, #080d08 55%)",
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
          {`${profile.name} · Project`}
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#e8f5e8",
            marginTop: 16,
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        {project?.shortDescription ? (
          <div
            style={{
              fontSize: 34,
              color: "#8aad8a",
              marginTop: 28,
              display: "flex",
            }}
          >
            {project.shortDescription}
          </div>
        ) : null}
      </div>
    ),
    { ...size }
  );
}
