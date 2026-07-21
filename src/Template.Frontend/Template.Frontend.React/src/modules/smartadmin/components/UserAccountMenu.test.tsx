import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { UserAccountMenu } from "@/modules/smartadmin/components/UserAccountMenu";
import { ThemeProvider } from "@/shared/utils/theme";

const user = {
  userId: "alex",
  firstName: "Alex",
  lastName: "Doe",
  email: "alex@example.com",
};

describe("UserAccountMenu", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute("data-theme");
  });

  it("shows the MonsterAdmin account summary and requested actions", async () => {
    const interaction = userEvent.setup();

    render(<UserAccountMenu user={user} isSigningOut={false} onSignOut={vi.fn()} />);

    await interaction.click(screen.getByRole("button", { name: "Open user account menu" }));

    expect(screen.getByRole("menu", { name: "User account" })).toBeVisible();
    expect(screen.getByText("Alex Doe")).toBeVisible();
    expect(screen.getByText("alex@example.com")).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "My Profile" })).toHaveAttribute("href", "/auth");
    expect(screen.getByText("Dark")).toBeVisible();
    expect(screen.getByRole("menuitemcheckbox", { name: "Switch to dark theme" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("menuitem", { name: "Logout" })).toBeVisible();
  });

  it("supports keyboard navigation, escape dismissal, and focus restoration", async () => {
    const interaction = userEvent.setup();

    render(<UserAccountMenu user={user} isSigningOut={false} onSignOut={vi.fn()} />);

    const trigger = screen.getByRole("button", { name: "Open user account menu" });
    await interaction.tab();
    expect(trigger).toHaveFocus();
    await interaction.keyboard("{Enter}");
    expect(screen.getByRole("menu")).toBeVisible();

    await interaction.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "My Profile" })).toHaveFocus();

    await interaction.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitemcheckbox", { name: "Switch to dark theme" })).toHaveFocus();

    await interaction.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Logout" })).toHaveFocus();

    await interaction.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("dismisses on outside interaction and invokes the existing sign-out callback", async () => {
    const interaction = userEvent.setup();
    const onSignOut = vi.fn().mockResolvedValue(undefined);

    render(
      <>
        <UserAccountMenu user={user} isSigningOut={false} onSignOut={onSignOut} />
        <button type="button">Outside</button>
      </>,
    );

    await interaction.click(screen.getByRole("button", { name: "Open user account menu" }));
    await interaction.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await interaction.click(screen.getByRole("button", { name: "Open user account menu" }));
    await interaction.click(screen.getByRole("menuitem", { name: "Logout" }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });

  it("toggles the persisted theme control placed between profile and logout", async () => {
    const interaction = userEvent.setup();

    document.documentElement.removeAttribute("data-theme");
    render(
      <ThemeProvider>
        <UserAccountMenu user={user} isSigningOut={false} onSignOut={vi.fn()} />
      </ThemeProvider>,
    );

    await interaction.click(screen.getByRole("button", { name: "Open user account menu" }));

    const themeControl = screen.getByRole("menuitemcheckbox", { name: "Switch to dark theme" });
    await interaction.click(themeControl);

    expect(themeControl).toHaveAttribute("aria-checked", "true");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(screen.getByText("Light")).toBeVisible();
    expect(screen.getByRole("menuitemcheckbox", { name: "Switch to light theme" })).toBeInTheDocument();
  });

  it("keeps the menu available while hovering between its trigger and panel", async () => {
    const interaction = userEvent.setup();

    render(<UserAccountMenu user={user} isSigningOut={false} onSignOut={vi.fn()} />);

    const trigger = screen.getByRole("button", { name: "Open user account menu" });
    await interaction.hover(trigger);
    expect(screen.getByRole("menu")).toBeVisible();

    await interaction.hover(screen.getByRole("menu", { name: "User account" }));
    expect(screen.getByRole("menu")).toBeVisible();
  });
});
