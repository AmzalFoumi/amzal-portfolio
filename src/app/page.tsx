import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { getPublishedCv, getSiteContent } from "@/lib/content";

export default async function Home() {
  // Content is read once here, on the server, and passed down. HeroSection is a
  // client component and so cannot reach the content port itself.
  const [{ profile }, styledCv, atsCv] = await Promise.all([
    getSiteContent(),
    getPublishedCv("styled"),
    getPublishedCv("ats"),
  ]);

  return (
    <>
      <HeroSection
        profile={profile}
        styledCv={styledCv}
        atsCv={atsCv}
        staticFallback={process.env.CV_FALLBACK_STATIC === "1"}
      />
      <ProjectsSection />
      <AboutSection />
      <EducationSection />
      <ExperienceSection />
    </>
  );
}
