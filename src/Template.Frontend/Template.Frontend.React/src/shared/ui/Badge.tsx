type BadgeVariant =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "secondary"
  | "solid-primary"
  | "solid-success"
  | "solid-danger"
  | "solid-warning"
  | "solid-info";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({ children, variant = "primary", className }: BadgeProps) {
  return (
    <span className={["sa-badge", `sa-badge-${variant}`, className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}
