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
    <div className="sa-progress-wrapper">
      {label || showValue ? (
        <div className="sa-progress-meta">
          {label ? (
            <span className="sa-progress-label">{label}</span>
          ) : null}
          {showValue ? (
            <span className="sa-progress-value">{Math.round(percent)}%</span>
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
