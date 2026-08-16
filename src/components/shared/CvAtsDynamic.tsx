/**
 * ATS-friendly CV as a real, selectable-text PDF.
 *
 * Built with @react-pdf/renderer (not HTML/print) so Applicant Tracking Systems
 * parse embedded text in a single-column, linear reading order. Uses the built-in
 * Helvetica family (no font registration) and ASCII punctuation to avoid glyph gaps.
 *
 * Purely presentational: it takes one fully-resolved `ResolvedCv` and renders it.
 * All filtering, ordering and per-variant overrides already happened in
 * `resolveCv` — this file contains no content decisions and imports no data.
 */
import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";

import type { CvSectionKey, ResolvedCv } from "@/types/cv";

const ACCENT = "#16a34a";
const TEXT = "#111111";
const MUTED = "#555555";
const BORDER = "#cccccc";

const styles = StyleSheet.create({
  page: {
    paddingVertical: 36,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: TEXT,
    lineHeight: 1.45,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.2,
    marginBottom: 3,
  },
  role: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    lineHeight: 1.2,
    marginBottom: 6,
  },
  contact: { fontSize: 8.5, color: MUTED, marginBottom: 2 },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 2,
    marginTop: 12,
    marginBottom: 5,
  },
  paragraph: { marginBottom: 4 },
  entry: { marginBottom: 7 },
  entryHead: { fontFamily: "Helvetica-Bold", marginBottom: 1 },
  entryMeta: { fontSize: 8.5, color: MUTED, marginBottom: 2 },
  bulletRow: { flexDirection: "row", marginBottom: 1.5, paddingRight: 6 },
  bulletDot: { width: 10, textAlign: "center" },
  bulletText: { flex: 1 },
  label: { fontFamily: "Helvetica-Bold" },
  link: { color: ACCENT, textDecoration: "none" },
});

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow} wrap={false}>
      <Text style={styles.bulletDot}>{"•"}</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function CvAtsDynamic({ cv }: { cv: ResolvedCv }) {
  const { profile } = cv;
  const title = (key: CvSectionKey) => cv.sectionTitles[key];

  /**
   * One renderer per section. `sectionOrder` drives which appear and in what
   * order; a section with no content renders nothing. Keys absent from this map
   * (e.g. "leadership") are simply not supported on the ATS CV.
   */
  const SECTIONS: Partial<Record<CvSectionKey, () => React.ReactNode>> = {
    summary: () =>
      profile.summary.length > 0 && (
        <>
          <SectionTitle>{title("summary")}</SectionTitle>
          {profile.summary.map((para, i) => (
            <Text key={i} style={styles.paragraph}>
              {para}
            </Text>
          ))}
        </>
      ),

    skills: () =>
      profile.techStacks.length > 0 && (
        <>
          <SectionTitle>{title("skills")}</SectionTitle>
          {profile.techStacks.map((group) => (
            <Text key={group.label} style={styles.paragraph}>
              <Text style={styles.label}>{group.label}: </Text>
              {group.items.join(", ")}
            </Text>
          ))}
        </>
      ),

    experience: () =>
      cv.experience.length > 0 && (
        <>
          <SectionTitle>{title("experience")}</SectionTitle>
          {cv.experience.map((role) => (
            <View key={role.key} style={styles.entry} wrap={false}>
              <Text style={styles.entryHead}>
                {role.role}, {role.organisation}
              </Text>
              <Text style={styles.entryMeta}>
                {role.startYear} - {role.endYear}
                {role.engagementType ? ` | ${role.engagementType}` : ""}
              </Text>
              <Bullet>{role.description}</Bullet>
              {role.tags && role.tags.length > 0 && (
                <Text style={styles.entryMeta}>
                  Focus: {role.tags.join(", ")}
                </Text>
              )}
            </View>
          ))}
        </>
      ),

    projects: () =>
      cv.projects.length > 0 && (
        <>
          <SectionTitle>{title("projects")}</SectionTitle>
          {cv.projects.map((project) => {
            const tags =
              typeof project.tagLimit === "number"
                ? project.tags.slice(0, project.tagLimit)
                : project.tags;
            return (
              <View key={project.key} style={styles.entry} wrap={false}>
                <Text style={styles.entryHead}>
                  {project.title}
                  {project.resolvedUrls.map((u) => (
                    <Text key={u.key}>
                      {" - "}
                      <Link src={u.url} style={styles.link}>
                        {u.url}
                      </Link>
                    </Text>
                  ))}
                </Text>
                <Text style={styles.paragraph}>{project.shortDescription}</Text>
                <Text style={styles.entryMeta}>Tech: {tags.join(", ")}</Text>
              </View>
            );
          })}
        </>
      ),

    education: () =>
      cv.education.length > 0 && (
        <>
          <SectionTitle>{title("education")}</SectionTitle>
          {cv.education.map((edu) => (
            <View key={edu.key} style={styles.entry} wrap={false}>
              <Text style={styles.entryHead}>
                {edu.degree} {edu.field}, {edu.institution}
              </Text>
              <Text style={styles.entryMeta}>
                {edu.startYear} - {edu.endYear}
                {edu.grade ? ` | ${edu.grade}` : ""}
              </Text>
              {edu.description && (
                <Text style={styles.paragraph}>{edu.description}</Text>
              )}
              {edu.achievements?.map((a, i) => (
                <Bullet key={i}>{a}</Bullet>
              ))}
            </View>
          ))}
        </>
      ),

    certifications: () =>
      cv.certifications.length > 0 && (
        <>
          <SectionTitle>{title("certifications")}</SectionTitle>
          {cv.certifications.map((cert) => (
            <View key={cert.key} style={styles.entry} wrap={false}>
              <Text style={styles.entryHead}>{cert.name}</Text>
              <Text style={styles.entryMeta}>
                {cert.issuer} | Issued {cert.issueDate}
              </Text>
              <Text style={styles.paragraph}>
                <Link src={cert.credentialUrl} style={styles.link}>
                  {cert.credentialUrl}
                </Link>
              </Text>
            </View>
          ))}
        </>
      ),

    /* Contact details intentionally omitted — "available upon request" is noted
       once below rather than repeated per referee. */
    references: () =>
      cv.references.length > 0 && (
        <>
          <SectionTitle>{title("references")}</SectionTitle>
          {cv.references.map((ref) => (
            <View key={ref.key} style={styles.entry} wrap={false}>
              <Text style={styles.entryHead}>
                {ref.name}
                {ref.role ? `, ${ref.role}` : ""}
                {ref.organization ? ` - ${ref.organization}` : ""}
              </Text>
              {ref.linkedinUrl && (
                <Text style={styles.entryMeta}>
                  <Link src={ref.linkedinUrl} style={styles.link}>
                    LinkedIn
                  </Link>
                </Text>
              )}
              {ref.description && (
                <Text style={styles.paragraph}>{ref.description}</Text>
              )}
            </View>
          ))}
          <Text style={styles.paragraph}>
            Contact details available upon request.
          </Text>
        </>
      ),
  };

  return (
    <Document
      title={`${profile.name} - CV`}
      author={profile.name}
      subject="Curriculum Vitae"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.role}>{profile.title}</Text>
        <Text style={styles.contact}>
          <Link src={`mailto:${profile.email}`} style={styles.link}>
            {profile.email}
          </Link>{" "}
          | {profile.phone} | {profile.location}
        </Text>
        <Text style={styles.contact}>
          Portfolio:{" "}
          <Link src={profile.portfolioUrl} style={styles.link}>
            {profile.portfolioUrl}
          </Link>{" "}
          | GitHub:{" "}
          <Link src={profile.githubUrl} style={styles.link}>
            {profile.githubUrl}
          </Link>{" "}
          | LinkedIn:{" "}
          <Link src={profile.linkedinUrl} style={styles.link}>
            {profile.linkedinUrl}
          </Link>
        </Text>

        {cv.sectionOrder.map((key) => (
          <View key={key}>{SECTIONS[key]?.()}</View>
        ))}
      </Page>
    </Document>
  );
}
