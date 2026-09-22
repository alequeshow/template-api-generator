import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HomeOverview } from "@/features/home/components/HomeOverview";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("HomeOverview", () => {
  it("renders the hero section with platform description", () => {
    render(<HomeOverview />);

    expect(
      screen.getByRole("heading", { name: "Template App Generator — Platform Overview" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in to get started" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("renders the four platform capability cards", () => {
    render(<HomeOverview />);

    expect(screen.getByText("One-schema, full-stack scaffolding")).toBeInTheDocument();
    expect(screen.getByText("BFF Authentication layer")).toBeInTheDocument();    
    expect(screen.getByText("Docker-first local development")).toBeInTheDocument();
  });

  it("renders the Experience timeline with the same items as the dashboard", () => {
    render(<HomeOverview />);

    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Senior Software Engineer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Full-Stack Engineer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "B.Sc. in Computer Science" })).toBeInTheDocument();
  });
});
