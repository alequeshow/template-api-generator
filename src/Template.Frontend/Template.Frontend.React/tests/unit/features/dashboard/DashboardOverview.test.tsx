import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";

describe("DashboardOverview", () => {
  it("replaces status cards with the chart showcase", () => {
    render(<DashboardOverview />);

    expect(screen.getByText("Monthly report")).toBeInTheDocument();
    expect(screen.getByText("Tiny charts")).toBeInTheDocument();
    expect(screen.getByText("Round progress")).toBeInTheDocument();
    expect(screen.queryByText("Session state")).not.toBeInTheDocument();
    expect(screen.queryByText("Status entries")).not.toBeInTheDocument();
  });
});
