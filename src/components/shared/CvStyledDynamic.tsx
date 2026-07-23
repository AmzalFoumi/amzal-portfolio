/**
 * Styled (human-facing) CV — data-driven variant.
 *
 * Same JSX structure/classes/print CSS hooks as `CvStyledStatic.tsx`, but every
 * entry is pulled from `src/data/*` and honors each entry's `showInStyledCv`
 * flag. Not wired into any page yet — `CvStyledStatic.tsx` remains the active,
 * hand-maintained component and this file is not yet imported anywhere.
 *
 * The "Leadership & Comm." section has no corresponding data model in
 * `src/data/*` (narrative AIESEC content, not structured), so it stays
 * hardcoded here too, matching `CvStyledStatic.tsx`.
 */
import { profile } from "@/data/profile";
import { education } from "@/data/education";
import { voluntary } from "@/data/voluntary";
import { projects } from "@/data/projects";
import { certifications } from "@/data/certifications";
import { references } from "@/data/references";

export function CvStyledDynamic() {
  const volunteering = voluntary
    .map((group) => ({
      ...group,
      roles: group.roles.filter((role) => role.showInStyledCv !== false),
    }))
    .filter((group) => group.roles.length > 0);

  const notableProjects = projects.filter(
    (project) => project.featured && project.showInStyledCv !== false,
  );

  const shownCertifications = certifications.filter(
    (cert) => cert.showInStyledCv !== false,
  );

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
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              {profile.summary[0]}
            </p>
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
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Portfolio"
                className="flex flex-col items-center gap-1 group hover:-translate-y-0.5 transition-transform"
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${profile.portfolioUrl}`}
                  alt="Portfolio QR"
                  className="w-[42px] h-[42px] border border-[var(--bg-border)] rounded-[4px] p-0.5 mix-blend-multiply bg-white shadow-sm group-hover:border-[var(--accent-brand)]"
                  loading="lazy"
                />
                <span className="text-[0.5rem] font-mono text-muted uppercase group-hover:text-[var(--accent-brand)]">
                  Portfolio
                </span>
              </a>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="flex flex-col items-center gap-1 group hover:-translate-y-0.5 transition-transform"
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${profile.githubUrl}`}
                  alt="GitHub QR"
                  className="w-[42px] h-[42px] border border-[var(--bg-border)] rounded-[4px] p-0.5 mix-blend-multiply bg-white shadow-sm group-hover:border-[var(--accent-brand)]"
                  loading="lazy"
                />
                <span className="text-[0.5rem] font-mono text-muted uppercase group-hover:text-[var(--accent-brand)]">
                  GitHub
                </span>
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="flex flex-col items-center gap-1 group hover:-translate-y-0.5 transition-transform"
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${profile.linkedinUrl}`}
                  alt="LinkedIn QR"
                  className="w-[42px] h-[42px] border border-[var(--bg-border)] rounded-[4px] p-0.5 mix-blend-multiply bg-white shadow-sm group-hover:border-[var(--accent-brand)]"
                  loading="lazy"
                />
                <span className="text-[0.5rem] font-mono text-muted uppercase group-hover:text-[var(--accent-brand)]">
                  LinkedIn
                </span>
              </a>
            </div>
          </div>
        </header>

        <div className="grid-layout">
          <div className="flex flex-col gap-6">
            <section>
              <h3 className="section-title">
                Technical Volunteering Experience
              </h3>

              {volunteering.map((group) =>
                group.roles.map((role, i) => (
                  <div
                    key={`${group.organisation}-${role.role}`}
                    className={i < group.roles.length - 1 ? "mb-4" : ""}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-sm">{role.role}</h4>
                      <span className="text-xs text-muted font-mono">
                        {role.startYear} - {role.endYear}
                      </span>
                    </div>
                    <p className="text-xs text-muted mb-1">
                      {group.organisation}
                    </p>
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
                )),
              )}
            </section>

            <section>
              <h3 className="section-title">Notable Projects</h3>

              {notableProjects.map((project, i) => {
                const urlPref = project.styledCvUrlPreference ?? "live";
                const url =
                  urlPref === "none"
                    ? undefined
                    : urlPref === "repo"
                      ? project.repoUrl?.trim()
                      : project.liveUrl?.trim();
                return (
                  <div
                    key={project.slug}
                    className={i < notableProjects.length - 1 ? "mb-4" : ""}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-sm">{project.title}</h4>
                      {url && (
                        <div className="flex gap-2">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono hover:underline text-[var(--accent-brand)]"
                          >
                            Link &#8599;
                          </a>
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
                );
              })}
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <section>
              <h3 className="section-title">Education</h3>
              {education.map((edu) => (
                <div
                  key={`${edu.institution}-${edu.field}`}
                  className="mb-4 last:mb-0"
                >
                  <h4 className="font-bold text-sm">
                    {edu.degree} {edu.field}
                  </h4>
                  <p className="text-xs font-medium mt-1">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-muted font-mono mb-2">
                    {edu.startYear} - {edu.endYear}
                  </p>

                  {(edu.grade || (edu.achievements && edu.achievements.length > 0)) && (
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
                    <p className="text-xs text-gray-700 mt-2">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </section>

            <section>
              <h3 className="section-title">Technical Skills</h3>

              {profile.techStacks.map((stack) => (
                <div key={stack.label} className="mb-3 last:mb-0">
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

            {shownCertifications.length > 0 && (
              <section>
                <h3 className="section-title">Certifications</h3>
                {shownCertifications.map((cert) => (
                  <div
                    key={cert.credentialId}
                    className="flex justify-between items-center gap-3"
                  >
                    <p className="text-xs text-gray-700 leading-relaxed">
                      <strong>{cert.name}</strong> — {cert.issuer} (
                      {cert.issueDate})
                    </p>
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Verify credential"
                      className="flex flex-col items-center gap-1 group hover:-translate-y-0.5 transition-transform shrink-0"
                    >
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${cert.credentialUrl}`}
                        alt="Certification verification QR"
                        className="w-[42px] h-[42px] border border-[var(--bg-border)] rounded-[4px] p-0.5 mix-blend-multiply bg-white shadow-sm group-hover:border-[var(--accent-brand)]"
                        loading="lazy"
                      />
                      <span className="text-[0.5rem] font-mono text-muted uppercase group-hover:text-[var(--accent-brand)]">
                        Verify
                      </span>
                    </a>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>

        {references.length > 0 && (
          <section className="mt-6">
            <h3 className="section-title">References</h3>
            <div className="grid grid-cols-2 gap-4">
              {references.map((ref) => (
                <div key={ref.email} className="text-xs text-gray-700 leading-relaxed">
                  <p className="font-bold text-sm mb-0.5">{ref.name}</p>
                  {(ref.role || ref.organization) && (
                    <p className="text-muted mb-1">
                      {[ref.role, ref.organization].filter(Boolean).join(" - ")}
                    </p>
                  )}
                  <p className="font-mono">
                    <a href={`mailto:${ref.email}`} className="hover:underline">
                      {ref.email}
                    </a>
                    {ref.mobile ? ` | ${ref.mobile}` : ""}
                    {ref.linkedinUrl && (
                      <>
                        {" | "}
                        <a
                          href={ref.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-[var(--accent-brand)]"
                        >
                          LinkedIn
                        </a>
                      </>
                    )}
                  </p>
                  {ref.description && <p className="mt-1">{ref.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6">
          <h3 className="section-title">Leadership &amp; Comm.</h3>
          <div className="text-xs text-gray-700 leading-relaxed">
            <p className="mb-2">
              <strong>AIESEC SLIIT IR Manager</strong> (Jan 2025 - Present):
              Managed 3 teams for Incoming Global Talent. Awarded
              <em>&ldquo;Best Performing iGT IR &amp; M Leader&rdquo;</em> at
              Legacy 2025.
            </p>
            <p>
              <strong>Core Competencies:</strong> Cross-Cultural
              Collaboration, Stakeholder Management, Agile Team Leadership.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
