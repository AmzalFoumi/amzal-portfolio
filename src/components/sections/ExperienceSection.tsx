"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TagBadge } from "@/components/shared/TagBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { voluntary } from "@/data/voluntary";
import { workExperience } from "@/data/workExperience";
import type { ExperienceGroup, ExperienceRole } from "@/types";

function getOverallRange(roles: ExperienceRole[]) {
  if (roles.length === 0) {
    return "";
  }

  const mostRecent = roles[0];
  const oldest = roles[roles.length - 1];

  return `${oldest.startYear} – ${mostRecent.endYear}`;
}

function getGroupMeta(entry: ExperienceGroup) {
  return [entry.location, entry.workMode, entry.engagementType].filter(
    Boolean,
  ) as string[];
}

function getRoleMeta(role: ExperienceRole, entry: ExperienceGroup) {
  const parts: string[] = [];

  if (role.location && role.location !== entry.location) {
    parts.push(role.location);
  }

  if (role.workMode && role.workMode !== entry.workMode) {
    parts.push(role.workMode);
  }

  if (role.engagementType && role.engagementType !== entry.engagementType) {
    parts.push(role.engagementType);
  }

  return parts;
}

function ExperienceCards({ entries }: { entries: ExperienceGroup[] }) {
  return (
    <div className="grid grid-cols-1 gap-5">
      {entries.map((entry, i) => {
        const groupMeta = getGroupMeta(entry);

        return (
          <motion.div
            key={`${entry.organisation}-${i}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card
              className="card-glow h-full flex flex-col rounded-lg border py-0"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "var(--bg-border)",
              }}
            >
              <CardHeader
                className="px-6 pt-6 pb-4"
                style={{
                  paddingLeft: "1.5rem",
                  paddingRight: "1.5rem",
                  paddingTop: "1.5rem",
                  paddingBottom: "1rem",
                }}
              >
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
                  {entry.roles[0] && (
                    <p
                      className="font-mono text-sm mt-0.5"
                      style={{ color: "var(--accent-bright)" }}
                    >
                      {entry.roles[0].role}
                    </p>
                  )}
                  {groupMeta.length > 0 && (
                    <p
                      className="font-mono text-xs mt-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {groupMeta.join(" · ")}
                    </p>
                  )}
                </div>
                <CardAction>
                  <span
                    className="font-mono text-xs px-2.5 py-1 rounded-md shrink-0"
                    style={{
                      background: "var(--bg-border)",
                      color: "var(--text-tertiary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getOverallRange(entry.roles)}
                  </span>
                </CardAction>
              </CardHeader>

              <CardContent
                className="px-6 pb-6"
                style={{
                  paddingLeft: "1.5rem",
                  paddingRight: "1.5rem",
                  paddingBottom: "1.5rem",
                }}
              >
                <Accordion type="single" collapsible>
                  {entry.roles.map((role, roleIndex) => {
                    const roleMeta = getRoleMeta(role, entry);

                    return (
                      <AccordionItem
                        key={`${entry.organisation}-${role.role}-${roleIndex}`}
                        value={`${entry.organisation}-${roleIndex}`}
                      >
                        <AccordionTrigger className="gap-4 px-0 pt-3 pb-10">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm text-[var(--accent-bright)] group-hover/accordion-trigger:text-[var(--text-primary)]">
                              {role.role}
                            </span>
                            {roleMeta.length > 0 && (
                              <span className="font-mono text-xs text-[var(--text-tertiary)] group-hover/accordion-trigger:text-[var(--text-secondary)]">
                                {roleMeta.join(" · ")}
                              </span>
                            )}
                          </div>
                          <span className="col-start-2 w-40 shrink-0 text-right font-mono text-xs tabular-nums text-[var(--text-tertiary)] group-hover/accordion-trigger:text-[var(--text-secondary)]">
                            {role.startYear} – {role.endYear}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-3">
                          <p
                            className="font-mono text-sm leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {role.description}
                          </p>
                          {role.tags && role.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-3">
                              {role.tags.map((tag) => (
                                <TagBadge
                                  key={`${role.role}-${tag}`}
                                  label={tag}
                                  size="sm"
                                />
                              ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="section"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="section-container">
        <SectionHeading number="04" title="Experience" />

        <div className="space-y-12">
          <div>
            <ExperienceCards entries={workExperience} />
          </div>

          <div>
            <p
              className="font-mono text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--text-tertiary)" }}
            >
              Volunteering Experience
            </p>
            <ExperienceCards entries={voluntary} />
          </div>
        </div>
      </div>
    </section>
  );
}
