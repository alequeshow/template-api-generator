import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProgressBar } from "@/shared/ui/ProgressBar";
import { RoundProgressBar } from "@/shared/ui/RoundProgressBar";
import { LineChart, RealtimeLineChart } from "@/shared/ui/charts";

const series = [{ key: "value", label: "Value", color: "primary" as const }];
const data = [
  { label: "One", value: 10 },
  { label: "Two", value: 25 },
];

describe("shared chart primitives", () => {
  it("renders an accessible empty state", () => {
    render(<LineChart ariaLabel="Empty sales trend" data={[]} series={series} />);

    expect(screen.getByRole("img", { name: "Empty sales trend: no data available" })).toHaveTextContent("No data available");
  });

  it("supports sharp interpolation and named highlighted values", () => {
    render(
      <LineChart
        ariaLabel="Weekly sales"
        data={data}
        series={series}
        interpolation="linear"
        highlights={[{ seriesKey: "value", label: "Two", markerLabel: "Best day" }]}
      />,
    );

    expect(screen.getByText("Best day: 25")).toBeInTheDocument();
  });

  it("provides a keyboard-operable real-time pause control", async () => {
    const user = userEvent.setup();
    render(<RealtimeLineChart ariaLabel="Requests over time" initialData={data} series={series} intervalMs={10_000} />);

    const control = screen.getByRole("button", { name: "Pause updates" });
    await user.click(control);

    expect(control).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Resume updates" })).toBeInTheDocument();
  });

  it("normalizes linear and round progress values", () => {
    render(
      <>
        <ProgressBar label="Upload" value={150} showValue />
        <RoundProgressBar label="Profile completion" value={-5} />
      </>,
    );

    expect(screen.getByRole("progressbar", { name: "Upload" })).toHaveAttribute("aria-valuenow", "150");
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Profile completion" })).toHaveAttribute("aria-valuenow", "-5");
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders image center content with meaningful alternative text", () => {
    render(
      <RoundProgressBar
        label="Profile completion"
        value={75}
        image={{ src: "/users/default-avatar.jpg", alt: "Sample account avatar" }}
      />,
    );

    expect(screen.getByRole("img", { name: "Sample account avatar" })).toBeInTheDocument();
  });
});
