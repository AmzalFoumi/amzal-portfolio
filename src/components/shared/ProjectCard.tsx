"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
          className="card-glow h-full flex flex-col rounded-lg border py-0"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--bg-border)",
          }}
        >
          {/* Header */}
          <CardHeader
            className="px-6 pt-6 pb-3"
            style={{
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingTop: "1.5rem",
              paddingBottom: "0.75rem",
            }}
          >
            <h3
              className="font-display text-lg font-semibold leading-tight tracking-tight group-hover:text-accent-bright transition-colors"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
            >
              {project.title}
            </h3>
            <CardAction className="flex items-center gap-2 shrink-0 mt-0.5">
              {project.repoUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      project.repoUrl,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  className="p-1.5 rounded-md transition-colors hover:bg-bg-elevated"
                  style={{ color: "var(--text-tertiary)" }}
                  aria-label="View source"
                >
                  <GithubLogoIcon size={15} />
                </button>
              )}
              {project.liveUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      project.liveUrl,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  className="p-1.5 rounded-md transition-colors hover:bg-bg-elevated"
                  style={{ color: "var(--text-tertiary)" }}
                  aria-label="Live site"
                >
                  <ArrowUpRight size={15} />
                </button>
              )}
            </CardAction>
          </CardHeader>

          {/* Description */}
          <CardContent
            className="px-6 pb-4"
            style={{
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingBottom: "1rem",
            }}
          >
            <p
              className="font-mono text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {project.shortDescription}
            </p>
          </CardContent>

          {/* Footer */}
          <CardFooter
            className="justify-between px-6 pb-6 pt-4"
            style={{
              borderColor: "var(--bg-border)",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingTop: "1rem",
              paddingBottom: "1.5rem",
            }}
          >
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
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
