/**
 * ATS-friendly CV as a real, selectable-text PDF.
 *
 * Built with @react-pdf/renderer (not HTML/print) so Applicant Tracking Systems
 * parse embedded text in a single-column, linear reading order. Content is fully
 * data-driven from `src/data/*` — keep the site data accurate and this stays in
 * sync automatically. Uses the built-in Helvetica family (no font registration)
 * and ASCII punctuation to avoid glyph gaps.
 */
import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";

import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { education } from "@/data/education";
import { voluntary } from "@/data/voluntary";
import { certifications } from "@/data/certifications";

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

export function CvPdfDocument() {
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

        {/* Summary */}
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        {profile.summary.map((para, i) => (
          <Text key={i} style={styles.paragraph}>
            {para}
          </Text>
        ))}

        {/* Skills */}
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        {profile.techStacks.map((group) => (
          <Text key={group.label} style={styles.paragraph}>
            <Text style={styles.label}>{group.label}: </Text>
            {group.items.join(", ")}
          </Text>
        ))}

        {/* Experience — honors `showInAtsCv` on each role (undefined = shown).
            A group whose roles are all hidden is skipped entirely. */}
        <Text style={styles.sectionTitle}>Experience</Text>
        {voluntary.map((group) => {
          const roles = group.roles.filter(
            (role) => role.showInAtsCv !== false,
          );
          if (roles.length === 0) {
            return null;
          }
          return roles.map((role) => (
            <View
              key={`${group.organisation}-${role.role}`}
              style={styles.entry}
              wrap={false}
            >
              <Text style={styles.entryHead}>
                {role.role}, {group.organisation}
              </Text>
              <Text style={styles.entryMeta}>
                {role.startYear} - {role.endYear}
                {group.engagementType ? ` | ${group.engagementType}` : ""}
              </Text>
              <Bullet>{role.description}</Bullet>
              {role.tags && role.tags.length > 0 && (
                <Text style={styles.entryMeta}>
                  Focus: {role.tags.join(", ")}
                </Text>
              )}
            </View>
          ));
        })}

        {/* Projects — honors `showInAtsCv` on each project (undefined = shown). */}
        <Text style={styles.sectionTitle}>Projects</Text>
        {projects
          .filter((project) => project.showInAtsCv !== false)
          .map((project) => {
          const tags =
            typeof project.tagLimit === "number"
              ? project.tags.slice(0, project.tagLimit)
              : project.tags;
          const urlPref = project.atsCvUrlPreference ?? "live";
          const url =
            urlPref === "none"
              ? undefined
              : urlPref === "repo"
                ? project.repoUrl?.trim()
                : project.liveUrl?.trim();
          return (
            <View key={project.slug} style={styles.entry} wrap={false}>
              <Text style={styles.entryHead}>
                {project.title}
                {url ? " - " : ""}
                {url ? (
                  <Link src={url} style={styles.link}>
                    {url}
                  </Link>
                ) : null}
              </Text>
              <Text style={styles.paragraph}>{project.shortDescription}</Text>
              <Text style={styles.entryMeta}>Tech: {tags.join(", ")}</Text>
            </View>
          );
          })}

        {/* Education */}
        <Text style={styles.sectionTitle}>Education</Text>
        {education.map((edu) => (
          <View
            key={`${edu.institution}-${edu.field}`}
            style={styles.entry}
            wrap={false}
          >
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

        {/* Certifications — honors `showInAtsCv` on each cert (undefined = shown). */}
        {certifications.filter((cert) => cert.showInAtsCv !== false).length >
          0 && (
          <>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications
              .filter((cert) => cert.showInAtsCv !== false)
              .map((cert) => (
                <View
                  key={cert.credentialId}
                  style={styles.entry}
                  wrap={false}
                >
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
        )}

      </Page>
    </Document>
  );
}
