interface TagBadgeProps {
  label: string;
  size?: "sm" | "md";
}

export function TagBadge({ label, size = "md" }: TagBadgeProps) {
  return (
    <span
      className="tag"
      style={{
        fontSize: size === "sm" ? "0.65rem" : "0.7rem",
        padding: size === "sm" ? "1px 8px" : "2px 10px",
      }}
    >
      {label}
    </span>
  );
}
