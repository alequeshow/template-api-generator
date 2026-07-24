"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ChartColor = "primary" | "success" | "info" | "warning" | "danger";

export type ChartPoint = {
  label: string;
  [seriesKey: string]: string | number;
};

export type ChartSeries = {
  key: string;
  label: string;
  color?: ChartColor;
};

export type SliceDatum = {
  label: string;
  value: number;
  color?: ChartColor;
};

type CartesianChartProps = {
  data: ChartPoint[];
  series: ChartSeries[];
  ariaLabel: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
};

export type LineInterpolation = "smooth" | "linear";

export type LineHighlight = {
  seriesKey: string;
  label: string;
  markerLabel?: string;
  value?: number;
  color?: ChartColor;
};

export type LineChartProps = CartesianChartProps & {
  interpolation?: LineInterpolation;
  highlights?: LineHighlight[];
};

type PieChartProps = {
  data: SliceDatum[];
  ariaLabel: string;
  height?: number;
  showLegend?: boolean;
};

type SparklineProps = {
  data: ChartPoint[];
  series: ChartSeries;
  ariaLabel: string;
  height?: number;
};

type RealtimeLineChartProps = Omit<LineChartProps, "data"> & {
  initialData: ChartPoint[];
  intervalMs?: number;
  maxPoints?: number;
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
};

const colorVariables: Record<ChartColor, string> = {
  primary: "var(--sa-primary)",
  success: "var(--sa-success)",
  info: "var(--sa-info)",
  warning: "var(--sa-warning-dark)",
  danger: "var(--sa-danger)",
};

const defaultColors: ChartColor[] = ["primary", "success", "info", "warning", "danger"];

function colorFor(seriesOrSlice: { color?: ChartColor }, index: number) {
  return colorVariables[seriesOrSlice.color ?? defaultColors[index % defaultColors.length]];
}

function EmptyChart({ ariaLabel, height }: Pick<CartesianChartProps, "ariaLabel" | "height">) {
  return (
    <div className="sa-chart-empty" style={{ minHeight: height }} role="img" aria-label={`${ariaLabel}: no data available`}>
      No data available
    </div>
  );
}

function ChartFrame({
  ariaLabel,
  height,
  children,
}: {
  ariaLabel: string;
  height: number;
  children: ReactNode;
}) {
  const descriptionId = useId();

  return (
    <figure className="sa-chart" aria-labelledby={descriptionId}>
      <figcaption id={descriptionId} className="sa-sr-only">
        {ariaLabel}
      </figcaption>
      <div className="sa-chart-canvas" style={{ height }}>
        {children}
      </div>
    </figure>
  );
}

function CartesianFrame({
  data,
  series,
  ariaLabel,
  height = 280,
  summary,
  children,
}: CartesianChartProps & { summary?: ReactNode; children: ReactNode }) {
  if (data.length === 0 || series.length === 0) {
    return <EmptyChart ariaLabel={ariaLabel} height={height} />;
  }

  return (
    <ChartFrame ariaLabel={ariaLabel} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
      <div className="sa-sr-only">
        {series.map((entry) => `${entry.label}: ${data.map((point) => `${point.label} ${point[entry.key]}`).join(", ")}`).join(". ")}
      </div>
      {summary}
    </ChartFrame>
  );
}

function CartesianAxes({ showGrid }: Pick<CartesianChartProps, "showGrid">) {
  return (
    <>
      {showGrid ? <CartesianGrid stroke="var(--sa-chart-grid)" vertical={false} /> : null}
      <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--sa-text-muted)", fontSize: 12 }} />
      <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--sa-text-muted)", fontSize: 12 }} width={36} />
      <Tooltip contentStyle={{ background: "var(--sa-surface)", border: "1px solid var(--sa-border)", borderRadius: "var(--sa-radius-sm)" }} />
    </>
  );
}

function ChartLegend({ showLegend }: Pick<CartesianChartProps, "showLegend">) {
  return showLegend ? <Legend wrapperStyle={{ fontSize: "0.8125rem" }} /> : null;
}

export function BarChart(props: CartesianChartProps) {
  return (
    <CartesianFrame {...props}>
      <RechartsBarChart data={props.data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianAxes showGrid={props.showGrid ?? true} />
        <ChartLegend showLegend={props.showLegend ?? true} />
        {props.series.map((entry, index) => (
          <Bar key={entry.key} dataKey={entry.key} name={entry.label} fill={colorFor(entry, index)} radius={[3, 3, 0, 0]} />
        ))}
      </RechartsBarChart>
    </CartesianFrame>
  );
}

function highlightedValue(data: ChartPoint[], highlight: LineHighlight) {
  if (highlight.value !== undefined) {
    return highlight.value;
  }

  const value = data.find((point) => point.label === highlight.label)?.[highlight.seriesKey];
  return typeof value === "number" ? value : undefined;
}

function highlightedLabel(highlight: LineHighlight, value: number) {
  return `${highlight.markerLabel ?? highlight.label}: ${value}`;
}

export function LineChart(props: LineChartProps) {
  const interpolation = props.interpolation === "linear" ? "linear" : "monotone";
  const highlightSummary = props.highlights
    ?.map((highlight) => {
      const value = highlightedValue(props.data, highlight);
      return value === undefined ? null : highlightedLabel(highlight, value);
    })
    .filter(Boolean)
    .join(", ");

  return (
    <CartesianFrame {...props} summary={highlightSummary ? <div className="sa-sr-only">{highlightSummary}</div> : undefined}>
      <RechartsLineChart data={props.data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianAxes showGrid={props.showGrid ?? true} />
        <ChartLegend showLegend={props.showLegend ?? true} />
        {props.series.map((entry, index) => (
          <Line key={entry.key} type={interpolation} dataKey={entry.key} name={entry.label} stroke={colorFor(entry, index)} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
        ))}
        {props.highlights?.flatMap((highlight, index) => {
          const value = highlightedValue(props.data, highlight);

          if (value === undefined) {
            return [];
          }

          const seriesIndex = props.series.findIndex((entry) => entry.key === highlight.seriesKey);
          const color = colorFor(highlight, seriesIndex >= 0 ? seriesIndex : index);

          return (
            <ReferenceDot
              key={`${highlight.seriesKey}-${highlight.label}`}
              x={highlight.label}
              y={value}
              r={5}
              fill={color}
              stroke="var(--sa-surface)"
              strokeWidth={2}
              label={{
                value: highlightedLabel(highlight, value),
                position: "top",
                fill: color,
                fontSize: 12,
                fontWeight: 700,
              }}
            />
          );
        })}
      </RechartsLineChart>
    </CartesianFrame>
  );
}

export function AreaChart(props: CartesianChartProps) {
  return (
    <CartesianFrame {...props}>
      <RechartsAreaChart data={props.data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {props.series.map((entry, index) => (
            <linearGradient key={entry.key} id={`area-${entry.key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={colorFor(entry, index)} stopOpacity={0.36} />
              <stop offset="95%" stopColor={colorFor(entry, index)} stopOpacity={0.03} />
            </linearGradient>
          ))}
        </defs>
        <CartesianAxes showGrid={props.showGrid ?? true} />
        <ChartLegend showLegend={props.showLegend ?? true} />
        {props.series.map((entry, index) => (
          <Area key={entry.key} type="monotone" dataKey={entry.key} name={entry.label} stroke={colorFor(entry, index)} fill={`url(#area-${entry.key})`} strokeWidth={2.5} />
        ))}
      </RechartsAreaChart>
    </CartesianFrame>
  );
}

function PieFamilyChart({ data, ariaLabel, height = 280, showLegend = true, innerRadius = 0 }: PieChartProps & { innerRadius?: number }) {
  if (data.length === 0) {
    return <EmptyChart ariaLabel={ariaLabel} height={height} />;
  }

  return (
    <ChartFrame ariaLabel={ariaLabel} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip contentStyle={{ background: "var(--sa-surface)", border: "1px solid var(--sa-border)", borderRadius: "var(--sa-radius-sm)" }} />
          {showLegend ? <Legend wrapperStyle={{ fontSize: "0.8125rem" }} /> : null}
          <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="46%" outerRadius="72%" innerRadius={`${innerRadius}%`} paddingAngle={2}>
            {data.map((slice, index) => (
              <Cell key={slice.label} fill={colorFor(slice, index)} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="sa-sr-only">{data.map((slice) => `${slice.label}: ${slice.value}`).join(", ")}</div>
    </ChartFrame>
  );
}

export function PieChart(props: PieChartProps) {
  return <PieFamilyChart {...props} />;
}

export function DoughnutChart(props: PieChartProps) {
  return <PieFamilyChart {...props} innerRadius={62} />;
}

export function Sparkline({ data, series, ariaLabel, height = 44 }: SparklineProps) {
  if (data.length === 0) {
    return <EmptyChart ariaLabel={ariaLabel} height={height} />;
  }

  return (
    <ChartFrame ariaLabel={ariaLabel} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <Line type="monotone" dataKey={series.key} stroke={colorFor(series, 0)} strokeWidth={2.25} dot={false} isAnimationActive={false} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function nextPoint(data: ChartPoint[], series: ChartSeries[]) {
  const latest = data.at(-1);
  const numericLabel = data.length + 1;
  const point: ChartPoint = { label: String(numericLabel) };

  for (const entry of series) {
    const latestValue = latest?.[entry.key];
    const previous = typeof latestValue === "number" ? latestValue : 50;
    point[entry.key] = Math.max(0, Math.round(previous + (Math.random() - 0.5) * 20));
  }

  return point;
}

export function RealtimeLineChart({
  initialData,
  series,
  intervalMs = 1500,
  maxPoints = 12,
  paused: controlledPaused,
  onPausedChange,
  ...chartProps
}: RealtimeLineChartProps) {
  const [data, setData] = useState(initialData);
  const [uncontrolledPaused, setUncontrolledPaused] = useState(false);
  const paused = controlledPaused ?? uncontrolledPaused;
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (paused || reducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setData((current) => [...current, nextPoint(current, series)].slice(-maxPoints));
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, maxPoints, paused, reducedMotion, series]);

  function togglePaused() {
    const nextPaused = !paused;
    if (controlledPaused === undefined) {
      setUncontrolledPaused(nextPaused);
    }
    onPausedChange?.(nextPaused);
  }

  return (
    <div className="sa-realtime-chart">
      <div className="sa-realtime-chart-actions">
        <button type="button" className="sa-chart-control" onClick={togglePaused} aria-pressed={paused}>
          {paused ? "Resume updates" : "Pause updates"}
        </button>
      </div>
      <LineChart {...chartProps} data={data} series={series} />
    </div>
  );
}
