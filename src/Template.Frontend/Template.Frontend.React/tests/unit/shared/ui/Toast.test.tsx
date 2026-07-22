import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";

import { ToastProvider, useToast, type ToastOptions } from "@/shared/ui/Toast";

function ToastTrigger({ notifications }: { notifications: ToastOptions[] }) {
  const { addToast } = useToast();

  useEffect(() => {
    notifications.forEach((notification) => addToast(notification));
  }, [addToast, notifications]);

  return null;
}

describe("ToastProvider", () => {
  it.each(["info", "warning", "success", "danger"] as const)(
    "renders the %s severity with its title and message",
    (severity) => {
      render(
        <ToastProvider>
          <ToastTrigger
            notifications={[
              {
                severity,
                title: `${severity} title`,
                message: `${severity} message`,
                timeoutMs: false,
              },
            ]}
          />
        </ToastProvider>,
      );

      expect(screen.getByText(`${severity} title`)).toBeVisible();
      expect(screen.getByText(`${severity} message`)).toBeVisible();
      expect(document.querySelector(`[data-severity="${severity}"]`)).toBeInTheDocument();
    },
  );

  it("uses a polite live region for non-danger notifications and assertive for danger", () => {
    render(
      <ToastProvider>
        <ToastTrigger
          notifications={[
            { severity: "success", message: "Saved", timeoutMs: false },
            { severity: "danger", message: "Failed", timeoutMs: false },
          ]}
        />
      </ToastProvider>,
    );

    expect(screen.getByText("Saved").closest("[aria-live]")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Failed").closest("[aria-live]")).toHaveAttribute("aria-live", "assertive");
  });

  it("dismisses a notification through its keyboard-operable close button", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ToastTrigger notifications={[{ severity: "info", message: "Informational", timeoutMs: false }]} />
      </ToastProvider>,
    );

    const dismiss = screen.getByRole("button", { name: "Dismiss info notification" });
    await user.tab();
    expect(dismiss).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(screen.queryByText("Informational")).not.toBeInTheDocument();
  });

  it("removes timed notifications and exposes their progress", () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <ToastTrigger notifications={[{ severity: "warning", message: "Expiring", timeoutMs: 100 }]} />
      </ToastProvider>,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.queryByText("Expiring")).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it("caps the stack at six notifications and removes the oldest", () => {
    const notifications = Array.from({ length: 7 }, (_, index) => ({
      severity: "info" as const,
      message: `Notification ${index + 1}`,
      timeoutMs: false as const,
    }));

    render(
      <ToastProvider>
        <ToastTrigger notifications={notifications} />
      </ToastProvider>,
    );

    expect(screen.queryByText("Notification 1")).not.toBeInTheDocument();
    expect(screen.getByText("Notification 2")).toBeVisible();
    expect(screen.getByText("Notification 7")).toBeVisible();
    expect(document.querySelectorAll(".sa-toast")).toHaveLength(6);
  });
});
