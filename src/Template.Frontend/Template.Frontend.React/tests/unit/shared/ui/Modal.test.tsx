import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "@/shared/ui/Modal";

describe("Modal", () => {
  it("renders animated SweetAlert-equivalent success and error icons", () => {
    const { rerender } = render(<Modal open variant="success" title="Saved" />);

    expect(document.querySelector(".sa-alert-modal-icon-success")).toBeInTheDocument();
    expect(document.querySelector(".sa-alert-modal-success-tip")).toBeInTheDocument();

    rerender(<Modal open variant="error" title="Failed" />);

    expect(document.querySelector(".sa-alert-modal-icon-error")).toBeInTheDocument();
    expect(document.querySelector(".sa-alert-modal-error-left")).toBeInTheDocument();
  });

  it("confirms at most once while the confirm action is pending", async () => {
    let resolveConfirmation: (() => void) | undefined;
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveConfirmation = resolve;
        }),
    );
    const user = userEvent.setup();

    render(
      <Modal
        open
        variant="confirmation"
        title="Delete status?"
        onConfirm={onConfirm}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    await user.click(confirmButton);
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Working..." })).toBeDisabled();

    await act(async () => {
      resolveConfirmation?.();
    });
  });

  it("uses timeout as a dismissal and exposes a progress indicator", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const onClose = vi.fn();

    render(
      <Modal
        open
        variant="confirmation"
        title="Delete status?"
        timeoutMs={100}
        showProgress
        onDismiss={onDismiss}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(onDismiss).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledWith("timeout");
    vi.useRealTimers();
  });

  it("honors escape and backdrop close policy", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal
        open
        variant="info"
        title="Notice"
        closePolicy={{ allowBackdropDismiss: false, allowEscapeDismiss: false }}
        onClose={onClose}
      />,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(document.querySelector(".sa-alert-modal-overlay")!);
    expect(onClose).not.toHaveBeenCalled();

    rerender(<Modal open variant="info" title="Notice" onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledWith("dismiss");
  });
});
