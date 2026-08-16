"use client";

import { useEffect, useState } from "react";
import type { PDFViewer as PDFViewerType } from "@react-pdf/renderer";
import type { CvAtsDynamic as CvAtsDynamicType } from "@/components/shared/CvAtsDynamic";
import type { ResolvedCv } from "@/types/cv";

/**
 * Renders an ATS CV in an embedded PDF viewer.
 *
 * @react-pdf/renderer is loaded on demand and never during SSR, so it stays out
 * of the initial bundle — the same treatment HeroSection gives it.
 */
export function CvAtsPreview({ cv }: { cv: ResolvedCv }) {
  const [modules, setModules] = useState<{
    PDFViewer: typeof PDFViewerType;
    CvAtsDynamic: typeof CvAtsDynamicType;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import("@react-pdf/renderer"),
      import("@/components/shared/CvAtsDynamic"),
    ]).then(([{ PDFViewer }, { CvAtsDynamic }]) => {
      if (!cancelled) setModules({ PDFViewer, CvAtsDynamic });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!modules) {
    return (
      <p className="font-mono text-xs text-center py-16 text-muted">
        Loading ATS CV preview...
      </p>
    );
  }

  return (
    <modules.PDFViewer width="100%" height={900} showToolbar>
      <modules.CvAtsDynamic cv={cv} />
    </modules.PDFViewer>
  );
}
