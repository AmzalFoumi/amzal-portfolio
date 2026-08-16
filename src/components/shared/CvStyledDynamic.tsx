/**
 * Styled (human-facing) CV.
 *
 * Purely presentational: it takes one fully-resolved `ResolvedCv` and renders it.
 * All filtering, ordering and per-variant overrides already happened in
 * `resolveCv` — this file contains no content decisions and imports no data.
 *
 * The `.cv-root` / `.cv-page` / `.section-title` / `.cv-entry` class hooks are
 * load-bearing: `globals.css` overrides the site's dark tokens to a light theme
 * inside `.cv-root`, and the `@media print` rules key off `.cv-entry` to keep
 * entries from being sliced across a page boundary.
 */
import type { CvSectionKey, ResolvedCv } from "@/types/cv";

/**
 * Where each section sits in the two-column layout.
 *
 * `sectionOrder` controls order *within* a column rather than reflowing the whole
 * page — the 2fr/1fr split is part of the design, not content. "summary" renders
 * in the header rather than as a section of its own.
 */
const PLACEMENT: Record<CvSectionKey, "header" | "left" | "right" | "full"> = {
  summary: "header",
  experience: "left",
  projects: "left",
  education: "right",
  skills: "right",
  certifications: "right",
  leadership: "full",
  references: "full",
};

const QR = (data: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data)}`;

function QrLink({
  href,
  label,
  alt,
}: {
  href: string;
  label: string;
  alt: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="flex flex-col items-center gap-1 group hover:-translate-y-0.5 transition-transform"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={QR(href)}
        alt={alt}
        className="w-[42px] h-[42px] border border-[var(--bg-border)] rounded-[4px] p-0.5 mix-blend-multiply bg-white shadow-sm group-hover:border-[var(--accent-brand)]"
        loading="lazy"
      />
      <span className="text-[0.5rem] font-mono text-muted uppercase group-hover:text-[var(--accent-brand)]">
        {label}
      </span>
    </a>
  );
}

export function CvStyledDynamic({ cv }: { cv: ResolvedCv }) {
  const { profile } = cv;
  const title = (key: CvSectionKey) => cv.sectionTitles[key];

  const SECTIONS: Partial<Record<CvSectionKey, () => React.ReactNode>> = {
    experience: () =>
      cv.experience.length > 0 && (
        <section>
          <h3 className="section-title">{title("experience")}</h3>
          {cv.experience.map((role, i) => (
            <div
              key={role.key}
              className={`cv-entry ${i < cv.experience.length - 1 ? "mb-4" : ""}`}
            >
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-sm">{role.role}</h4>
                <span className="text-xs text-muted font-mono">
                  {role.startYear} - {role.endYear}
                </span>
              </div>
              <p className="text-xs text-muted mb-1">{role.organisation}</p>
              <ul className="list-disc list-inside text-xs space-y-1 text-gray-700 ml-1">
                <li>{role.description}</li>
              </ul>
              {role.tags && role.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {role.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      ),

    projects: () =>
      cv.projects.length > 0 && (
        <section>
          <h3 className="section-title">{title("projects")}</h3>
          {cv.projects.map((project, i) => (
            <div
              key={project.key}
              className={`cv-entry ${i < cv.projects.length - 1 ? "mb-4" : ""}`}
            >
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-sm">{project.title}</h4>
                {project.resolvedUrls.length > 0 && (
                  <div className="flex gap-2">
                    {project.resolvedUrls.map((u) => (
                      <a
                        key={u.key}
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={u.label}
                        className="text-xs font-mono hover:underline text-[var(--accent-brand)]"
                      >
                        {u.label} &#8599;
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-2">
                {project.shortDescription}
              </p>
              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      ),

    education: () =>
      cv.education.length > 0 && (
        <section>
          <h3 className="section-title">{title("education")}</h3>
          {cv.education.map((edu) => (
            <div key={edu.key} className="cv-entry mb-4 last:mb-0">
              <h4 className="font-bold text-sm">
                {edu.degree} {edu.field}
              </h4>
              <p className="text-xs font-medium mt-1">{edu.institution}</p>
              <p className="text-xs text-muted font-mono mb-2">
                {edu.startYear} - {edu.endYear}
              </p>

              {(edu.grade ||
                (edu.achievements && edu.achievements.length > 0)) && (
                <div className="bg-[var(--bg-base)] p-3 rounded-md border border-[var(--bg-border)]">
                  {edu.grade && (
                    <div className="text-2xl font-bold text-[var(--accent-brand)] leading-none mb-1">
                      {edu.grade}
                    </div>
                  )}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="list-none text-xs space-y-1 text-gray-700">
                      {edu.achievements.map((a) => (
                        <li key={a} className="flex items-start gap-1">
                          <span className="text-[var(--accent-brand)]">
                            &rsaquo;
                          </span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {edu.description && (
                <p className="text-xs text-gray-700 mt-2">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      ),

    skills: () =>
      profile.techStacks.length > 0 && (
        <section>
          <h3 className="section-title">{title("skills")}</h3>
          {profile.techStacks.map((stack) => (
            <div key={stack.label} className="cv-entry mb-3 last:mb-0">
              <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
                {stack.label}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {stack.items.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      ),

    certifications: () =>
      cv.certifications.length > 0 && (
        <section>
          <h3 className="section-title">{title("certifications")}</h3>
          {cv.certifications.map((cert) => (
            <div
              key={cert.key}
              className="cv-entry flex justify-between items-center gap-3"
            >
              <p className="text-xs text-gray-700 leading-relaxed">
                <strong>{cert.name}</strong> — {cert.issuer} ({cert.issueDate})
              </p>
              <QrLink
                href={cert.credentialUrl}
                label="Verify"
                alt="Certification verification QR"
              />
            </div>
          ))}
        </section>
      ),

    leadership: () =>
      (cv.leadership.body.length > 0 ||
        cv.leadership.coreCompetencies.length > 0) && (
        <section className="mt-6">
          <h3 className="section-title">{title("leadership")}</h3>
          <div className="text-xs text-gray-700 leading-relaxed">
            {cv.leadership.body.map((para, i) => (
              <p key={i} className="cv-entry mb-2">
                {para}
              </p>
            ))}
            {cv.leadership.coreCompetencies.length > 0 && (
              <p className="cv-entry">
                <strong>Core Competencies:</strong>{" "}
                {cv.leadership.coreCompetencies.join(", ")}.
              </p>
            )}
          </div>
        </section>
      ),

    /* Contact details intentionally omitted — "available upon request" is noted
       once below rather than repeated per referee. */
    references: () =>
      cv.references.length > 0 && (
        <section className="mt-6">
          <h3 className="section-title">{title("references")}</h3>
          <div className="grid grid-cols-2 gap-4">
            {cv.references.map((ref) => (
              <div key={ref.key} className="cv-entry text-xs text-gray-700">
                <p className="font-bold">{ref.name}</p>
                {(ref.role || ref.organization) && (
                  <p className="text-muted">
                    {ref.role}
                    {ref.role && ref.organization ? ", " : ""}
                    {ref.organization}
                  </p>
                )}
                {ref.description && <p className="mt-1">{ref.description}</p>}
                {ref.linkedinUrl && (
                  <a
                    href={ref.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono hover:underline text-[var(--accent-brand)]"
                  >
                    LinkedIn &#8599;
                  </a>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-2">
            Contact details available upon request.
          </p>
        </section>
      ),
  };

  const column = (side: "left" | "right" | "full") =>
    cv.sectionOrder
      .filter((key) => PLACEMENT[key] === side)
      .map((key) => <div key={key}>{SECTIONS[key]?.()}</div>);

  return (
    <div className="cv-root">
      <div className="cv-page dot-grid p-10">
        <header className="border-b border-[var(--bg-border)] pb-6 mb-6 flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-1">
              {profile.name}
            </h1>
            <h2 className="text-lg font-medium text-[var(--accent-brand)] mb-3">
              {profile.title}
            </h2>
            {cv.sectionOrder.includes("summary") &&
              profile.summary.map((para, i) => (
                <p
                  key={i}
                  className="text-sm text-muted max-w-2xl leading-relaxed"
                >
                  {para}
                </p>
              ))}
          </div>

          <div className="flex flex-col items-end gap-3 border-l border-[var(--bg-border)] pl-4 shrink-0">
            <div className="text-right text-xs font-mono flex flex-col gap-1.5">
              <a href={`mailto:${profile.email}`} className="hover:underline">
                {profile.email}
              </a>
              <span>{profile.phone}</span>
              <span>{profile.location}</span>
            </div>

            <div className="flex gap-2 mt-1">
              <QrLink
                href={profile.portfolioUrl}
                label="Portfolio"
                alt="Portfolio QR"
              />
              <QrLink href={profile.githubUrl} label="GitHub" alt="GitHub QR" />
              <QrLink
                href={profile.linkedinUrl}
                label="LinkedIn"
                alt="LinkedIn QR"
              />
            </div>
          </div>
        </header>

        <div className="grid-layout">
          <div className="flex flex-col gap-6">{column("left")}</div>
          <div className="flex flex-col gap-6">{column("right")}</div>
        </div>

        {column("full")}
      </div>
    </div>
  );
}
