"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TagBadge } from "@/components/shared/TagBadge";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={project.featured ? "sm:col-span-2" : ""}
    >
      <Link href={`/projects/${project.slug}`} className="block h-full group">
        <Card
          className="card-glow h-full flex flex-col p-6 rounded-[var(--radius-lg)] border"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--bg-border)",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3
              className="font-display text-lg font-semibold leading-tight tracking-tight group-hover:text-accent-bright transition-colors"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
            >
              {project.title}
            </h3>
            <div className="flex items-center gap-2 shrink-0 mt-0.5">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-elevated)]"
                  style={{ color: "var(--text-tertiary)" }}
                  aria-label="View source"
                >
                  <GithubLogoIcon size={15} />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-elevated)]"
                  style={{ color: "var(--text-tertiary)" }}
                  aria-label="Live site"
                >
                  <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p
            className="font-mono text-sm leading-relaxed mb-4 flex-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.shortDescription}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid var(--bg-border)" }}>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 4).map((tag) => (
                <TagBadge key={tag} label={tag} size="sm" />
              ))}
            </div>
            <span
              className="font-mono text-xs shrink-0 ml-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              {project.year}
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
