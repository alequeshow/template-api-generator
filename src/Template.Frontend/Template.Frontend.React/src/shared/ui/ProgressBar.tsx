type ProgressBarVariant = "primary" | "success" | "danger" | "warning" | "info";

type ProgressBarProps = {
  value: number;
  max?: number;
  variant?: ProgressBarVariant;
  label?: string;
  showValue?: boolean;
};

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  label,
  showValue = false,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      {label || showValue ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {label ? (
            <span style={{ fontSize: "0.875rem", color: "var(--sa-text-muted)" }}>{label}</span>
          ) : null}
          {showValue ? (
            <span style={{ fontSize: "0.8125rem", color: "var(--sa-text-muted)" }}>
              {Math.round(percent)}%
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        className="sa-progress"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={["sa-progress-bar", variant !== "primary" ? `sa-progress-bar-${variant}` : ""].filter(Boolean).join(" ")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
