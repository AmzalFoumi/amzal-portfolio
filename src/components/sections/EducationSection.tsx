"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { education } from "@/data/education";

export function EducationSection() {
  return (
    <section id="education" className="section">
      <div className="section-container">
        <SectionHeading number="03" title="Education" />

        {/* Timeline */}
        <div className="relative pl-8 space-y-12">
          {/* Vertical line */}
          <div
            className="absolute left-0 top-2 bottom-2 w-0.5"
            style={{ background: "var(--bg-border)" }}
          />

          {education.map((entry, i) => (
            <motion.div
              key={`${entry.institution}-${i}`}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              {/* Dot */}
              <span
                className="absolute -left-8 top-1.5 w-3 h-3 rounded-full border-2 -translate-x-1.25"
                style={{
                  background: "var(--accent-bright)",
                  borderColor: "var(--bg-base)",
                  boxShadow: "0 0 8px var(--accent-bright)",
                }}
              />

              {/* Year range */}
              <p
                className="font-mono text-xs mb-2 tracking-widest uppercase"
                style={{ color: "var(--text-tertiary)" }}
              >
                {entry.startYear} — {entry.endYear}
              </p>

              {/* Degree */}
              <h3
                className="font-display text-xl font-bold mb-0.5"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--text-primary)",
                }}
              >
                {entry.field ? `${entry.degree} in ${entry.field}` : entry.degree}
              </h3>

              {/* Institution */}
              <p
                className="font-mono text-sm mb-3"
                style={{ color: "var(--accent-bright)" }}
              >
                {entry.institution}
              </p>

              {(entry.grade || entry.activities || entry.skills) && (
                <div className="space-y-2 mb-4">
                  {entry.grade && (
                    <p
                      className="font-mono text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span style={{ color: "var(--text-primary)" }}>Grade:</span> {entry.grade}
                    </p>
                  )}

                  {entry.activities && (
                    <p
                      className="font-mono text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span style={{ color: "var(--text-primary)" }}>Activities and societies:</span> {entry.activities}
                    </p>
                  )}

                  {entry.skills && entry.skills.length > 0 && (
                    <p
                      className="font-mono text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span style={{ color: "var(--text-primary)" }}>Skills:</span> {entry.skills.join(", ")}
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              {entry.description && (
                <p
                  className="font-mono text-sm leading-relaxed mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {entry.description}
                </p>
              )}

              {/* Achievements */}
              {entry.achievements && entry.achievements.length > 0 && (
                <ul className="space-y-1.5">
                  {entry.achievements.map((achievement, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span
                        className="font-mono text-xs mt-1 shrink-0"
                        style={{ color: "var(--accent-bright)" }}
                      >
                        ▸
                      </span>
                      <span
                        className="font-mono text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
