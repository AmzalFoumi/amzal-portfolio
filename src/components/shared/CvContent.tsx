/**
 * Styled (human-facing) CV — intentionally HARDCODED, not data-driven.
 *
 * NOTE: This component does NOT read `src/data/*`, so the `showInStyledCv` flag
 * on projects/roles has no effect here. To add or remove an entry from the styled
 * CV, edit the JSX below by hand. (The ATS PDF, `CvPdfDocument.tsx`, is the
 * data-driven one and honors the `showInAtsCv` flag.)
 */
export function CvContent() {
  return (
    <div className="cv-root">
      <div className="cv-page dot-grid p-10">
        <header className="border-b border-[var(--bg-border)] pb-6 mb-6 flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-1">
              Amzal Foumi
            </h1>
            <h2 className="text-lg font-medium text-[var(--accent-brand)] mb-3">
              Software Engineering Intern Candidate
            </h2>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              3rd-year SWE undergraduate at SLIIT (4.0 GPA) with a passion for
              full-stack, scalable infrastructure, and AI-enabled development.
              Proven experience building production applications, orchestrating
              microservices, and leading technical teams. Actively seeking an
              internship to deliver impactful, real-world solutions.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 border-l border-[var(--bg-border)] pl-4 shrink-0">
            <div className="text-right text-xs font-mono flex flex-col gap-1.5">
              <a
                href="mailto:mohamedamzal6@gmail.com"
                className="hover:underline"
              >
                mohamedamzal6@gmail.com
              </a>
              <span>+94 70 158 8018</span>
              <span>Dehiwala, Sri Lanka</span>
            </div>

            <div className="flex gap-2 mt-1">
              <a
                href="https://amzal-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                title="Portfolio"
                className="flex flex-col items-center gap-1 group hover:-translate-y-0.5 transition-transform"
              >
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://amzal-portfolio.vercel.app/"
                  alt="Portfolio QR"
                  className="w-[42px] h-[42px] border border-[var(--bg-border)] rounded-[4px] p-0.5 mix-blend-multiply bg-white shadow-sm group-hover:border-[var(--accent-brand)]"
                  loading="lazy"
                />
                <span className="text-[0.5rem] font-mono text-muted uppercase group-hover:text-[var(--accent-brand)]">
                  Portfolio
                </span>
              </a>
              <a
                href="https://github.com/AmzalFoumi"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="flex flex-col items-center gap-1 group hover:-translate-y-0.5 transition-transform"
              >
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://github.com/AmzalFoumi"
                  alt="GitHub QR"
                  className="w-[42px] h-[42px] border border-[var(--bg-border)] rounded-[4px] p-0.5 mix-blend-multiply bg-white shadow-sm group-hover:border-[var(--accent-brand)]"
                  loading="lazy"
                />
                <span className="text-[0.5rem] font-mono text-muted uppercase group-hover:text-[var(--accent-brand)]">
                  GitHub
                </span>
              </a>
              <a
                href="https://www.linkedin.com/in/amzalfoumi/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="flex flex-col items-center gap-1 group hover:-translate-y-0.5 transition-transform"
              >
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.linkedin.com/in/amzalfoumi/"
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

              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-sm">
                    SE Team Lead - National Dev Team
                  </h4>
                  <span className="text-xs text-muted font-mono">
                    Feb 2026 - Present
                  </span>
                </div>
                <p className="text-xs text-muted mb-1">AIESEC in Sri Lanka</p>
                <ul className="list-disc list-inside text-xs space-y-1 text-gray-700 ml-1">
                  <li>
                    Leading a technical team developing enterprise-level AIESEC
                    applications.
                  </li>
                  <li>
                    Building a Finance dashboard powered by Supabase and React
                    with Recharts.
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-sm">
                    Software Engineer - National Dev Team
                  </h4>
                  <span className="text-xs text-muted font-mono">
                    Feb 2025 - Jan 2026
                  </span>
                </div>
                <p className="text-xs text-muted mb-1">AIESEC in Sri Lanka</p>
                <ul className="list-disc list-inside text-xs space-y-1 text-gray-700 ml-1">
                  <li>
                    Developed and maintained production apps for the AIESEC
                    network.
                  </li>
                  <li>
                    Collaborated with an agile-focused team to deliver scalable
                    infrastructure solutions.
                  </li>
                </ul>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="tag">Next.js</span>
                  <span className="tag">React</span>
                  <span className="tag">Node.js</span>
                  <span className="tag">TypeScript</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="section-title">Notable Projects</h3>

              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-sm">Distributed Health</h4>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com/Distributed-Health-System"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono hover:underline text-[var(--accent-brand)]"
                    >
                      GitHub &#8599;
                    </a>
                    <a
                      href="https://medium.com/@mohamedamzal6/system-design-from-minikube-to-eks-with-terraform-e024a54f4a5a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono hover:underline text-[var(--accent-brand)]"
                    >
                      Article &#8599;
                    </a>
                  </div>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  Cloud-native healthcare platform featuring microservices
                  architecture. Includes AI symptom checking, Doctor
                  appointments, Telemedicine via Agora, and report management.
                  Orchestrated containerized services with Kubernetes on AWS EKS
                  (provisioned via Terraform) and implemented a GitOps CD
                  pipeline (GitHub Actions, ArgoCD).
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="tag">Next.js</span>
                  <span className="tag">Nest.js</span>
                  <span className="tag">Kubernetes</span>
                  <span className="tag">AWS EKS</span>
                  <span className="tag">Terraform</span>
                  <span className="tag">ArgoCD</span>
                  <span className="tag">Gemini API</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-sm">Itinerary.ai</h4>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  AI-powered web app for tourists to generate, share, and book
                  travel itineraries. Achieved an A+ (Top 0.3% out of 1,500+
                  students) in the 2nd-year IT Project module.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="tag">Next.js</span>
                  <span className="tag">Node.js</span>
                  <span className="tag">MongoDB</span>
                  <span className="tag">MinIO</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-sm">KidsFeed</h4>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  School meals management platform with Meal Planning,
                  Attendance Tracking, and FIFO Inventory. Built using
                  Domain-Driven Design and layered architecture with robust RBAC
                  (Clerk).
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="tag">React</span>
                  <span className="tag">Express.js</span>
                  <span className="tag">Tailwind</span>
                  <span className="tag">Clerk</span>
                </div>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <section>
              <h3 className="section-title">Education</h3>
              <div>
                <h4 className="font-bold text-sm">
                  BSc IT (Software Engineering)
                </h4>
                <p className="text-xs font-medium mt-1">SLIIT</p>
                <p className="text-xs text-muted font-mono mb-2">
                  Oct 2023 - Dec 2027
                </p>

                <div className="bg-[var(--bg-base)] p-3 rounded-md border border-[var(--bg-border)]">
                  <div className="text-2xl font-bold text-[var(--accent-brand)] leading-none mb-1">
                    4.0{" "}
                    <span className="text-sm text-gray-500 font-normal">
                      GPA
                    </span>
                  </div>
                  <ul className="list-none text-xs space-y-1 text-gray-700">
                    <li className="flex items-start gap-1">
                      <span className="text-[var(--accent-brand)]">
                        &rsaquo;
                      </span>
                      Consistent Dean&apos;s List
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[var(--accent-brand)]">
                        &rsaquo;
                      </span>
                      Top 1% Merit Scholarship
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="section-title">Technical Skills</h3>

              <div className="mb-3">
                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Languages &amp; Frameworks
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <span className="tag">React</span>
                  <span className="tag">Next.js</span>
                  <span className="tag">Node.js</span>
                  <span className="tag">Express.js</span>
                  <span className="tag">Nest.js</span>
                  <span className="tag">TypeScript</span>
                  <span className="tag">Java</span>
                  <span className="tag">Kotlin</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Architecture, Infrastructure &amp; other Tools
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <span className="tag">Kubernetes</span>
                  <span className="tag">Docker</span>
                  <span className="tag">Amazon Web Services</span>
                  <span className="tag">Microservices</span>
                  <span className="tag">Domain Driven Design</span>
                  <span className="tag">MVC</span>
                  <span className="tag">GitOps</span>
                  <span className="tag">ArgoCD</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="section-title">Certifications</h3>
              <div className="flex justify-between items-center gap-3">
                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong>AWS Certified AI Practitioner</strong> — Amazon Web
                  Services (Jul 2026)
                </p>
                <a
                  href="https://www.credly.com/badges/55eb817e-6eb4-4405-a18b-465476128171/public_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Verify credential"
                  className="flex flex-col items-center gap-1 group hover:-translate-y-0.5 transition-transform shrink-0"
                >
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.credly.com/badges/55eb817e-6eb4-4405-a18b-465476128171/public_url"
                    alt="Certification verification QR"
                    className="w-[42px] h-[42px] border border-[var(--bg-border)] rounded-[4px] p-0.5 mix-blend-multiply bg-white shadow-sm group-hover:border-[var(--accent-brand)]"
                    loading="lazy"
                  />
                  <span className="text-[0.5rem] font-mono text-muted uppercase group-hover:text-[var(--accent-brand)]">
                    Verify
                  </span>
                </a>
              </div>
            </section>
          </div>
        </div>

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
