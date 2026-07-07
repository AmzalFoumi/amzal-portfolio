import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/data/profile";
import { Analytics } from "@vercel/analytics/next";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
  display: "swap",
});

const siteDescription =
  "SWE Undergrad at SLIIT focused on AI-enabled software development, DevOps, and leadership in live teams.";
const defaultTitle = `${profile.name} — SWE Undergrad @ SLIIT`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: defaultTitle,
    template: `%s — ${profile.name}`,
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: defaultTitle,
    description: siteDescription,
    url: "/",
    siteName: profile.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteDescription,
  },
  verification: {
    google: "smQkI3qpjv_hI9_4h16Jj56g1PT_3OljNGxsI4hGr_c",
  },
};

// Person structured data (JSON-LD) — enables a richer Google presence / knowledge panel.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.siteUrl,
  jobTitle: "Software Engineering Undergraduate",
  alumniOf: { "@type": "CollegeOrUniversity", name: "SLIIT" },
  sameAs: [profile.githubUrl, profile.linkedinUrl],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Navbar />
        <main className="flex-1">
          {children}
          <Analytics />
        </main>
        <Footer />
      </body>
    </html>
  );
}
