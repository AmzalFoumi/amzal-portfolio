"use client";

import Link from "next/link";
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  EnvelopeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/data/profile";

const SOCIAL_LINKS = [
  { label: "GitHub", href: profile.githubUrl, icon: GithubLogoIcon },
  { label: "LinkedIn", href: profile.linkedinUrl, icon: LinkedinLogoIcon },
  { label: "Email", href: `mailto:${profile.email}`, icon: EnvelopeIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--bg-border)",
      }}
    >
      <div className="section-container py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: name + tagline */}
          <div>
            <p
              className="font-display text-sm font-semibold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
            >
              {profile.name}
            </p>
            <p
              className="font-mono text-xs mt-0.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              {profile.title}
            </p>
          </div>

          {/* Right: socials */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  href.startsWith("mailto") ? undefined : "noopener noreferrer"
                }
                aria-label={label}
                className="p-2 rounded-md transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--accent-bright)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--text-tertiary)")
                }
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p
          className="font-mono text-xs text-center mt-6"
          style={{ color: "var(--text-tertiary)" }}
        >
          &copy; {year} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
