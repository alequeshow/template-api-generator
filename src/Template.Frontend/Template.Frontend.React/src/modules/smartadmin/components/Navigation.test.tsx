import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Navigation } from "@/modules/smartadmin/components/Navigation";
import { navigationItems } from "@/modules/smartadmin/navigation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Navigation", () => {
  it("renders every menu item with its icon followed by its label", () => {
    render(<Navigation />);

    navigationItems.forEach((item) => {
      const link = screen.getByRole("link", { name: item.label });
      const icon = link.querySelector("i");

      expect(icon).not.toBeNull();
      expect(icon?.className).toContain(item.icon);
      // Icon must precede the label text within the link.
      expect(link.firstElementChild).toBe(icon);
      expect(link.textContent).toBe(item.label);
    });
  });

  it("uses the requested icon for each specific menu entry", () => {
    render(<Navigation />);

    expect(screen.getByRole("link", { name: "Home" }).querySelector("i")?.className).toBe(
      "fa fa-home sa-navigation-icon"
    );
    expect(screen.getByRole("link", { name: "Dashboard" }).querySelector("i")?.className).toBe(
      "ti-bar-chart sa-navigation-icon"
    );
    expect(screen.getByRole("link", { name: "Status" }).querySelector("i")?.className).toBe(
      "mdi mdi-check-all sa-navigation-icon"
    );
  });
});
