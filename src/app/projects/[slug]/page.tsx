import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/shared/TagBadge";
import { projects } from "@/data/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — [YOUR NAME]`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) notFound();

  const project = projects[idx];
  const prevProject = idx > 0 ? projects[idx - 1] : null;
  const nextProject = idx < projects.length - 1 ? projects[idx + 1] : null;

  const paragraphs = project.fullDescription
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen pt-24 pb-24">
      <article className="mx-auto px-6" style={{ maxWidth: "760px" }}>
        {/* Back button */}
        <div className="mb-10">
          <Link href="/#projects">
            <Button
              variant="ghost"
              className="font-mono text-sm gap-2 -ml-2 px-2"
              style={{ color: "var(--text-secondary)" }}
            >
              <ArrowLeft size={16} />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Featured Image / Hero Section */}
        <div
          className="rounded-[var(--radius-lg)] border overflow-hidden mb-10 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-surface)] min-h-96 flex items-center justify-center"
          style={{ borderColor: "var(--bg-border)" }}
        >
          <div className="text-center px-8">
            <p
              className="font-mono text-sm uppercase tracking-widest mb-4"
              style={{ color: "var(--text-tertiary)" }}
            >
              Project Showcase
            </p>
            <h2
              className="font-display text-3xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
            >
              {project.title}
            </h2>
          </div>
        </div>

        {/* Title */}
        <h1
          className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          {project.title}
        </h1>

        {/* Year + Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <span
            className="font-mono text-sm mr-2"
            style={{ color: "var(--text-tertiary)" }}
          >
            {project.year}
          </span>
          {project.tags.map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>

        {/* Divider */}
        <hr className="mb-10" style={{ borderColor: "var(--bg-border)" }} />

        {/* Full description */}
        <div className="space-y-5 mb-12">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="font-mono text-sm leading-loose"
              style={{ color: "var(--text-secondary)" }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Links */}
        {(project.liveUrl || project.repoUrl) && (
          <div className="mb-8">
            <p
              className="font-mono text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              Links
            </p>
            <div className="flex flex-wrap gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    className="font-mono text-sm gap-2"
                    style={{
                      background: "var(--accent-bright)",
                      color: "var(--bg-base)",
                    }}
                  >
                    Live Site <ArrowUpRight size={14} />
                  </Button>
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-mono text-sm gap-2 border"
                    style={{
                      borderColor: "var(--bg-border)",
                      color: "var(--text-secondary)",
                      background: "transparent",
                    }}
                  >
                    <GithubLogoIcon size={14} /> View Source
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Prev / Next navigation */}
        <div
          className="pt-6 border-t grid grid-cols-2 gap-4"
          style={{ borderColor: "var(--bg-border)" }}
        >
          <div>
            {prevProject && (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex flex-col gap-0 px-4 py-2 rounded-[var(--radius-md)] border transition-colors"
                style={{
                  borderColor: "var(--bg-border)",
                  background: "var(--bg-surface)",
                }}
              >
                <span
                  className="font-mono text-xs flex items-center gap-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <ChevronLeft size={12} /> Previous
                </span>
                <span
                  className="font-display text-sm font-semibold group-hover:text-[var(--accent-bright)] transition-colors"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--text-primary)",
                  }}
                >
                  {prevProject.title}
                </span>
              </Link>
            )}
          </div>
          <div className="flex justify-end">
            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex flex-col gap-0 px-4 py-2 rounded-[var(--radius-md)] border text-right transition-colors"
                style={{
                  borderColor: "var(--bg-border)",
                  background: "var(--bg-surface)",
                }}
              >
                <span
                  className="font-mono text-xs flex items-center justify-end gap-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Next <ChevronRight size={12} />
                </span>
                <span
                  className="font-display text-sm font-semibold group-hover:text-[var(--accent-bright)] transition-colors"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--text-primary)",
                  }}
                >
                  {nextProject.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
