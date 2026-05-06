"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Voluntary", href: "#voluntary" },
];

const SECTION_IDS = ["home", "about", "projects", "education", "voluntary"];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 24);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8, 13, 8, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--bg-border)"
          : "1px solid transparent",
      }}
    >
      <nav className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-base font-bold tracking-tight hover:text-accent-bright transition-colors"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          <span style={{ color: "var(--accent-bright)" }}>&gt;</span>
          &nbsp;{profile.name}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="relative px-4 py-2 font-mono text-sm rounded-md transition-colors"
                style={{
                  color: isActive
                    ? "var(--accent-bright)"
                    : "var(--text-secondary)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--text-secondary)";
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md"
                    style={{ background: "var(--bg-elevated)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}

          <a href={`mailto:${profile.email}`} className="ml-2">
            <Button
              size="lg"
              className="font-mono text-xs gap-2 px-4"
              style={{
                background: "var(--accent-bright)",
                color: "var(--bg-base)",
              }}
            >
              Contact <ArrowRight size={12} />
            </Button>
          </a>
        </div>

        {/* Mobile Nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button
              className="p-2 rounded-md"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Open menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 border-l flex flex-col pt-16"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--bg-border)",
            }}
          >
            <nav className="flex flex-col gap-1 flex-1">
              {NAV_LINKS.map((link, i) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left px-4 py-3 rounded-lg font-mono text-sm transition-colors"
                    style={{
                      color: isActive
                        ? "var(--accent-bright)"
                        : "var(--text-secondary)",
                      background: isActive
                        ? "var(--bg-elevated)"
                        : "transparent",
                    }}
                  >
                    {link.label}
                  </motion.button>
                );
              })}
            </nav>
            <div className="pb-8">
              <a
                href={`mailto:${profile.email}`}
                className="block"
                onClick={() => setOpen(false)}
              >
                <Button
                  size="lg"
                  className="w-full font-mono text-sm gap-2 px-4"
                  style={{
                    background: "var(--accent-bright)",
                    color: "var(--bg-base)",
                  }}
                >
                  Get in Touch <ArrowRight size={14} />
                </Button>
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
