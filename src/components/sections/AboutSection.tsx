"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { profile } from "@/data/profile";

const STATS = [
  { value: "4.0", label: "GPA" },
  { value: "Top 1%", label: "Batch rank" },
  // { value: "2", label: "Tech stacks" },
];

export function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="section-container">
        <SectionHeading number="01" title="About Me" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Text column */}
          <div className="lg:col-span-3 space-y-5">
            {profile.summary.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="font-mono text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {para}
              </motion.p>
            ))}

            {/* Technical skills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="pt-2 space-y-4"
            >
              <p
                className="font-mono text-xs uppercase tracking-widest text-center lg:text-left"
                style={{ color: "var(--text-tertiary)" }}
              >
                TECHNICAL SKILLS & EXPERIENCE
              </p>
              <div className="space-y-2">
                {profile.techStacks.map((stack) => (
                  <p
                    key={stack.label}
                    className="font-mono text-sm leading-relaxed text-center lg:text-left"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span
                      className="font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {stack.label}:
                    </span>{" "}
                    {stack.items.join(", ")}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats + decorative column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Stat cards */}
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card
                  className="rounded-lg border py-0"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--bg-border)",
                  }}
                >
                  <CardHeader className="gap-1">
                    <p
                      className="font-display text-4xl font-bold"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--accent-bright)",
                      }}
                    >
                      {value}
                    </p>
                    <p
                      className="font-mono text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {label}
                    </p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}

            {/* Decorative terminal block */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <Card
                className="rounded-lg border py-0"
                style={{
                  background: "var(--bg-elevated)",
                  borderColor: "var(--bg-border)",
                  color: "var(--text-tertiary)",
                }}
              >
                <CardContent className="font-mono text-xs leading-6">
                  <div className="pt-4">
                    <p style={{ color: "var(--accent-bright)" }}>$ whoami</p>
                    <p style={{ color: "var(--text-secondary)" }}>{profile.name}</p>
                    <p style={{ color: "var(--accent-bright)" }}>$ cat focus.txt</p>
                    <p>AI-enabled software development</p>
                    <p>DevOps and delivery</p>
                    <p>leadership in live teams</p>
                    <p style={{ color: "var(--accent-bright)" }}>$ _</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
