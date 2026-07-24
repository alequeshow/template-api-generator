import type { ReactNode } from "react";
import Image from "next/image";

type ProgressBarVariant = "primary" | "success" | "danger" | "warning" | "info";

type RoundProgressBarProps = {
  value: number;
  max?: number;
  variant?: ProgressBarVariant;
  label: string;
  size?: number;
  strokeWidth?: number;
  centerContent?: ReactNode;
  image?: {
    src: string;
    alt: string;
  };
};

export function RoundProgressBar({
  value,
  max = 100,
  variant = "primary",
  label,
  size = 112,
  strokeWidth = 6,
  centerContent,
  image,
}: RoundProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="sa-round-progress" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <svg className={`sa-round-progress-svg sa-round-progress-${variant}`} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="sa-round-progress-track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        <circle
          className="sa-round-progress-value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="sa-round-progress-content">
        {image ? <Image className="sa-round-progress-image" src={image.src} alt={image.alt} width={64} height={64} /> : centerContent ?? `${Math.round(percent)}%`}
      </span>
    </div>
  );
}
