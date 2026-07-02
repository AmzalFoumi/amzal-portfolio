/**
 * ATS-friendly CV.
 *
 * Single-column, semantic markup with plain-text contact info, standard section
 * headings, and no images / multi-column layout / decorative chips — so Applicant
 * Tracking Systems parse it in the correct reading order. Rendered for print /
 * "Save as PDF" from the CV modal. Keep this in sync with `CvContent` (the
 * human-facing styled version).
 */
export function AtsCvContent() {
  return (
    <div className="cv-root">
      <article className="ats-cv">
        <header>
          <h1>Amzal Foumi</h1>
          <p className="ats-role">Software Engineering Intern Candidate</p>
          <p className="ats-contact">
            mohamedamzal6@gmail.com | +94 70 158 8018 | Dehiwala, Sri Lanka
          </p>
          <p className="ats-contact">
            Portfolio: https://amzal-portfolio.vercel.app/ | GitHub:
            https://github.com/AmzalFoumi | LinkedIn:
            https://www.linkedin.com/in/amzalfoumi/
          </p>
        </header>

        <section>
          <h2>Professional Summary</h2>
          <p>
            3rd-year Software Engineering undergraduate at SLIIT (4.0 GPA) with a
            passion for full-stack development, scalable infrastructure, and
            AI-enabled development. Proven experience building production
            applications, orchestrating microservices, and leading technical
            teams. Actively seeking an internship to deliver impactful,
            real-world solutions.
          </p>
        </section>

        <section>
          <h2>Technical Skills</h2>
          <p>
            <strong>Languages &amp; Frameworks:</strong> React, Next.js, Node.js,
            Express.js, Nest.js, TypeScript, Java, Kotlin
          </p>
          <p>
            <strong>Architecture &amp; Tools:</strong> Kubernetes, Docker,
            Microservices, Domain-Driven Design, MVC, GitOps, ArgoCD, AWS EKS,
            Terraform
          </p>
        </section>

        <section>
          <h2>Experience</h2>

          <div className="ats-entry">
            <p className="ats-entry-head">
              <strong>Software Engineering Team Lead</strong>, AIESEC in Sri
              Lanka (National Dev Team)
            </p>
            <p className="ats-entry-meta">Feb 2026 - Present</p>
            <ul>
              <li>
                Leading a technical team developing enterprise-level AIESEC
                applications.
              </li>
              <li>
                Building a Finance dashboard powered by Supabase and React with
                Recharts.
              </li>
            </ul>
          </div>

          <div className="ats-entry">
            <p className="ats-entry-head">
              <strong>Web Developer</strong>, AIESEC in Malaysia (Entity Support
              Team)
            </p>
            <p className="ats-entry-meta">Apr 2026 - Present</p>
          </div>

          <div className="ats-entry">
            <p className="ats-entry-head">
              <strong>Software Engineer</strong>, AIESEC in Sri Lanka (National
              Dev Team)
            </p>
            <p className="ats-entry-meta">Feb 2025 - Jan 2026</p>
            <ul>
              <li>
                Developed and maintained production apps for the AIESEC network.
              </li>
              <li>
                Collaborated with an agile-focused team to deliver scalable
                infrastructure solutions.
              </li>
              <li>
                Technologies: Next.js, React, Node.js, TypeScript.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2>Projects</h2>

          <div className="ats-entry">
            <p className="ats-entry-head">
              <strong>Distributed Health</strong> —
              https://github.com/Distributed-Health-System
            </p>
            <p>
              Cloud-native healthcare platform featuring microservices
              architecture. Includes AI symptom checking, doctor appointments,
              telemedicine via Agora, and report management. Orchestrated
              containerized services with Kubernetes on AWS EKS (provisioned via
              Terraform) and implemented a GitOps CD pipeline (GitHub Actions,
              ArgoCD).
            </p>
            <p className="ats-entry-meta">
              Tech: Next.js, Nest.js, Kubernetes, AWS EKS, Terraform, ArgoCD,
              Gemini API
            </p>
          </div>

          <div className="ats-entry">
            <p className="ats-entry-head">
              <strong>Itinerary.ai</strong>
            </p>
            <p>
              AI-powered web app for tourists to generate, share, and book travel
              itineraries. Achieved an A+ (Top 0.3% out of 1,500+ students) in the
              2nd-year IT Project module.
            </p>
            <p className="ats-entry-meta">
              Tech: Next.js, Node.js, MongoDB, MinIO
            </p>
          </div>

          <div className="ats-entry">
            <p className="ats-entry-head">
              <strong>KidsFeed</strong>
            </p>
            <p>
              School meals management platform with meal planning, attendance
              tracking, and FIFO inventory. Built using Domain-Driven Design and
              layered architecture with robust RBAC (Clerk).
            </p>
            <p className="ats-entry-meta">
              Tech: React, Express.js, Tailwind, Clerk
            </p>
          </div>
        </section>

        <section>
          <h2>Education</h2>
          <div className="ats-entry">
            <p className="ats-entry-head">
              <strong>BSc IT (Software Engineering)</strong>, SLIIT
            </p>
            <p className="ats-entry-meta">Oct 2023 - Dec 2027 | GPA: 4.0</p>
            <ul>
              <li>Consistent Dean&apos;s List.</li>
              <li>Top 1% Merit Scholarship.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>Leadership &amp; Communication</h2>
          <div className="ats-entry">
            <p className="ats-entry-head">
              <strong>IR Manager</strong>, AIESEC SLIIT
            </p>
            <p className="ats-entry-meta">Jan 2025 - Present</p>
            <ul>
              <li>
                Managed 3 teams for Incoming Global Talent; awarded &ldquo;Best
                Performing iGT IR &amp; M Leader&rdquo; at Legacy 2025.
              </li>
              <li>
                Core competencies: cross-cultural collaboration, stakeholder
                management, agile team leadership.
              </li>
            </ul>
          </div>
        </section>
      </article>
    </div>
  );
}
