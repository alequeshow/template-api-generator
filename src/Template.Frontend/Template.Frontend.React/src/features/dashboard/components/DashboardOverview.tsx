"use client";

import { Panel } from "@/shared/ui/Panel";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { RoundProgressBar } from "@/shared/ui/RoundProgressBar";
import {
  AreaChart,
  BarChart,
  DoughnutChart,
  LineChart,
  PieChart,
  RealtimeLineChart,
  Sparkline,
  type ChartPoint,
} from "@/shared/ui/charts";

function createSeededRandom(seed: number) {
  let current = seed;

  return () => {
    current = (current * 16807) % 2147483647;
    return (current - 1) / 2147483646;
  };
}

const random = createSeededRandom(20260724);

function seriesPoints(labels: string[], keys: string[]): ChartPoint[] {
  return labels.map((label) => {
    const point: ChartPoint = { label };

    for (const key of keys) {
      point[key] = Math.round(15 + random() * 85);
    }

    return point;
  });
}

const monthlyData = seriesPoints(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"], ["visits", "orders"]);
const temperatureData = seriesPoints(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], ["high", "low"]);
const areaData = seriesPoints(["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"], ["active", "new"]);
const realtimeData = seriesPoints(["1", "2", "3", "4", "5", "6", "7", "8"], ["requests"]);
const sparkData = ["Traffic", "Signups", "Revenue", "Retention"].map((label) => ({
  label,
  data: seriesPoints(["1", "2", "3", "4", "5", "6", "7", "8"], ["value"]),
}));

const slices = [
  { label: "Direct", value: 42, color: "primary" as const },
  { label: "Search", value: 28, color: "success" as const },
  { label: "Social", value: 18, color: "info" as const },
  { label: "Email", value: 12, color: "warning" as const },
];

export function DashboardOverview() {
  return (
    <div className="sa-dashboard-chart-grid">
      <Panel title="Monthly report">
        <BarChart
          ariaLabel="Monthly traffic and orders bar chart"
          data={monthlyData}
          series={[
            { key: "visits", label: "Visits", color: "success" },
            { key: "orders", label: "Orders", color: "info" },
          ]}
        />
      </Panel>
      <Panel title="Weekly trend">
        <LineChart
          ariaLabel="Weekly high and low temperature line chart"
          data={temperatureData}
          series={[
            { key: "high", label: "High", color: "primary" },
            { key: "low", label: "Low", color: "info" },
          ]}
          interpolation="linear"
          highlights={[
            { seriesKey: "high", label: "Wed", markerLabel: "Weekly peak", color: "primary" },
            { seriesKey: "low", label: "Tue", markerLabel: "Weekly low", color: "info" },
          ]}
        />
      </Panel>
      <Panel title="Growth area">
        <AreaChart
          ariaLabel="Active and new users area chart"
          data={areaData}
          series={[
            { key: "active", label: "Active users", color: "success" },
            { key: "new", label: "New users", color: "primary" },
          ]}
        />
      </Panel>
      <Panel title="Real-time requests">
        <RealtimeLineChart
          ariaLabel="Moving requests per interval line chart"
          initialData={realtimeData}
          series={[{ key: "requests", label: "Requests", color: "info" }]}
          intervalMs={1500}
        />
      </Panel>
      <Panel title="Traffic sources">
        <PieChart ariaLabel="Traffic source pie chart" data={slices} />
      </Panel>
      <Panel title="Channel mix">
        <DoughnutChart ariaLabel="Channel mix doughnut chart" data={slices} />
      </Panel>
      <Panel title="Tiny charts">
        <div className="sa-dashboard-spark-grid">
          {sparkData.map((spark, index) => (
            <div className="sa-dashboard-spark-item" key={spark.label}>
              <span className="sa-dashboard-spark-label">{spark.label}</span>
              <Sparkline
                ariaLabel={`${spark.label} trend`}
                data={spark.data}
                series={{ key: "value", label: spark.label, color: ["success", "primary", "info", "danger"][index] as "success" | "primary" | "info" | "danger" }}
              />
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Progress">
        <div className="sa-progress-showcase">
          <ProgressBar label="Completed work" value={80} variant="success" showValue />
          <ProgressBar label="New accounts" value={30} variant="info" showValue />
          <ProgressBar label="Campaign reach" value={60} variant="primary" showValue />
          <ProgressBar label="Support queue" value={80} variant="danger" showValue />
        </div>
      </Panel>
      <Panel title="Round progress">
        <div className="sa-round-progress-list">
          <RoundProgressBar label="Profile completion" value={75} variant="info" />
          <RoundProgressBar label="Project delivery" value={68} variant="success" centerContent="68%" />
          <RoundProgressBar
            label="Account profile completion"
            value={82}
            variant="primary"
            image={{ src: "/users/default-avatar.jpg", alt: "Sample account avatar" }}
          />
        </div>
      </Panel>
    </div>
  );
}
