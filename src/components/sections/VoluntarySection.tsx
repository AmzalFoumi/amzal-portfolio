"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TagBadge } from "@/components/shared/TagBadge";
import { Card } from "@/components/ui/card";
import { voluntary } from "@/data/voluntary";

export function VoluntarySection() {
  return (
    <section
      id="voluntary"
      className="section"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="section-container">
        <SectionHeading number="04" title="Voluntary Experience" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {voluntary.map((entry, i) => (
            <motion.div
              key={`${entry.organisation}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card
                className="card-glow h-full flex flex-col p-6 rounded-lg border"
                style={{
                  background: "var(--bg-elevated)",
                  borderColor: "var(--bg-border)",
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3
                      className="font-display text-lg font-bold leading-tight"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {entry.organisation}
                    </h3>
                    <p
                      className="font-mono text-sm mt-0.5"
                      style={{ color: "var(--accent-bright)" }}
                    >
                      {entry.role}
                    </p>
                    {entry.location && (
                      <p
                        className="font-mono text-xs mt-1"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {entry.location}
                      </p>
                    )}
                  </div>
                  {/* Year badge */}
                  <span
                    className="font-mono text-xs px-2.5 py-1 rounded-md shrink-0"
                    style={{
                      background: "var(--bg-border)",
                      color: "var(--text-tertiary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.startYear} – {entry.endYear}
                  </span>
                </div>

                {/* Description */}
                <p
                  className="font-mono text-sm leading-relaxed flex-1 mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {entry.description}
                </p>

                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-4" style={{ borderTop: "1px solid var(--bg-border)" }}>
                    {entry.tags.map((tag) => (
                      <TagBadge key={tag} label={tag} size="sm" />
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
