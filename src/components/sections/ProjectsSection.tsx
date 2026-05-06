import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  // Featured projects first, then the rest
  const sorted = [...projects].sort((a, b) =>
    a.featured === b.featured ? 0 : a.featured ? -1 : 1,
  );

  return (
    <section
      id="projects"
      className="section"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="section-container">
        <SectionHeading
          number="02"
          title="Notable Projects"
          subtitle="A selection of things I've built"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
