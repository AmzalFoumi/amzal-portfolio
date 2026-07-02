"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  EnvelopeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/data/profile";
import { CvContent } from "@/components/shared/CvContent";

const SOCIAL_LINKS = [
  { label: "GitHub", href: profile.githubUrl, icon: GithubLogoIcon },
  { label: "LinkedIn", href: profile.linkedinUrl, icon: LinkedinLogoIcon },
  { label: "Email", href: `mailto:${profile.email}`, icon: EnvelopeIcon },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

export function HeroSection() {
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Render the styled CV into a hidden print portal, then trigger the browser
  // print dialog ("Save as PDF"). Print CSS scopes output to `.cv-print-root`.
  useEffect(() => {
    if (!isPrinting) {
      return;
    }

    const handleAfterPrint = () => setIsPrinting(false);
    window.addEventListener("afterprint", handleAfterPrint);
    const timer = window.setTimeout(() => window.print(), 100);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [isPrinting]);

  // Generate a real, selectable-text ATS PDF in-browser and download it. The
  // heavy @react-pdf/renderer lib is imported on demand so it stays out of the
  // initial hero bundle and never runs during SSR.
  const downloadAtsPdf = async () => {
    if (isGeneratingPdf) {
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const [{ pdf }, { CvPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/shared/CvPdfDocument"),
      ]);
      const blob = await pdf(<CvPdfDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Amzal-Foumi-CV.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  useEffect(() => {
    if (!isCvOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCvOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCvOpen]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center dot-grid"
    >
      {/* Gradient vignette over dot-grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, var(--bg-base) 100%)",
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "var(--shadow-glow)",
          filter: "blur(80px)",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="section-container relative z-10 pt-24 pb-16">
        {/* Label */}
        <motion.p
          {...fadeUp(0)}
          className="font-mono text-sm mb-4"
          style={{ color: "var(--accent-bright)" }}
        >
          &gt; hello, world
        </motion.p>

        {/* Name */}
        <motion.h1
          {...fadeUp(0.08)}
          className="font-display font-extrabold leading-none tracking-tight mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
            fontSize: "clamp(48px, 8vw, 96px)",
          }}
        >
          {profile.name}
        </motion.h1>

        {/* Role */}
        <motion.p
          {...fadeUp(0.16)}
          className="font-mono text-lg mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          {profile.siteHeadline}
        </motion.p>

        {/* Bio */}
        {/* <motion.p
          {...fadeUp(0.24)}
          className="font-mono text-sm leading-relaxed max-w-xl mb-10"
          style={{ color: "var(--text-secondary)" }}
        >
          {profile.summary[0]}
        </motion.p> */}

        {/* CTAs */}
        <motion.div {...fadeUp(0.32)} className="flex flex-wrap gap-3 mb-10">
          <Button
            onClick={() => scrollTo("projects")}
            className="font-mono text-sm gap-2 px-6"
            style={{
              background: "var(--accent-bright)",
              color: "var(--bg-base)",
            }}
          >
            View My Work <ArrowDown size={14} />
          </Button>
          <a href={`mailto:${profile.email}`}>
            <Button
              variant="outline"
              className="font-mono text-sm px-6 border"
              style={{
                borderColor: "var(--bg-border)",
                color: "var(--text-secondary)",
                background: "transparent",
              }}
            >
              Get in Touch
            </Button>
          </a>
          <Button
            variant="outline"
            className="font-mono text-sm px-6 border"
            style={{
              borderColor: "var(--bg-border)",
              color: "var(--text-secondary)",
              background: "transparent",
            }}
            onClick={() => setIsCvOpen(true)}
          >
            View CV
          </Button>
        </motion.div>

        {/* Social icons */}
        <motion.div {...fadeUp(0.4)} className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={
                href.startsWith("mailto") ? undefined : "noopener noreferrer"
              }
              aria-label={label}
              className="p-2 rounded-md border transition-all duration-200"
              style={{
                color: "var(--text-tertiary)",
                borderColor: "var(--bg-border)",
                background: "var(--bg-surface)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "var(--accent-bright)";
                el.style.borderColor = "var(--accent-bright)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "var(--text-tertiary)";
                el.style.borderColor = "var(--bg-border)";
              }}
            >
              <Icon size={18} />
            </a>
          ))}
          <span
            className="w-12 h-px"
            style={{ background: "var(--bg-border)" }}
          />
          <span
            className="font-mono text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            amzalfoumi
          </span>
        </motion.div>
      </div>

      {isCvOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-10">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCvOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Curriculum Vitae"
            className="relative z-10 w-full max-w-[980px] max-h-[90vh] overflow-y-auto rounded-2xl border p-4 shadow-2xl"
            style={{
              borderColor: "var(--bg-border)",
              background: "var(--bg-base)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap justify-end gap-2 mb-4">
              <Button
                variant="outline"
                className="font-mono text-xs px-3 py-1 h-auto border"
                style={{
                  borderColor: "var(--accent-bright)",
                  color: "var(--accent-bright)",
                  background: "transparent",
                }}
                onClick={downloadAtsPdf}
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? "Generating..." : "Download ATS CV"}
              </Button>
              <Button
                variant="outline"
                className="font-mono text-xs px-3 py-1 h-auto border"
                style={{
                  borderColor: "var(--bg-border)",
                  color: "var(--text-secondary)",
                  background: "transparent",
                }}
                onClick={() => setIsPrinting(true)}
              >
                Download Styled CV
              </Button>
              <Button
                variant="outline"
                className="font-mono text-xs px-3 py-1 h-auto border"
                style={{
                  borderColor: "var(--bg-border)",
                  color: "var(--text-secondary)",
                  background: "transparent",
                }}
                onClick={() => setIsCvOpen(false)}
              >
                Close
              </Button>
            </div>
            <CvContent />
          </div>
        </div>
      )}

      {/* Hidden print portal — only its contents reach the printer / PDF */}
      {isPrinting && (
        <div className="cv-print-root" aria-hidden="true">
          <CvContent />
        </div>
      )}
    </section>
  );
}
