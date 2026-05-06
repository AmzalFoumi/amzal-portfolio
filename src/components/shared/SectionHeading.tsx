interface SectionHeadingProps {
  number: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ number, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-12">
      <div className="flex items-baseline gap-4 mb-2">
        <span
          className="font-mono text-sm tracking-widest uppercase"
          style={{ color: "var(--accent-bright)" }}
        >
          {number}.
        </span>
        <h2
          className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h2>
        <span
          className="hidden sm:block flex-1 h-px"
          style={{ background: "var(--bg-border)" }}
        />
      </div>
      {subtitle && (
        <p
          className="font-mono text-sm ml-10"
          style={{ color: "var(--text-secondary)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
