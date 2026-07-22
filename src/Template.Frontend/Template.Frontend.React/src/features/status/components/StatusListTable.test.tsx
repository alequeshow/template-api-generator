import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import { StatusListTable } from "@/features/status/components/StatusListTable";
import { ToastProvider } from "@/shared/ui/Toast";

const mutateAsync = vi.fn();

vi.mock("next/link", () => ({
  default: ({ children, ...props }: ComponentProps<"a">) => <a {...props}>{children}</a>,
}));

vi.mock("@/features/status/hooks/useStatus", () => ({
  useStatusListQuery: () => ({
    data: [{ id: "status-1", value: "Active", description: "Current status", timeStamp: "2026-01-01T00:00:00.000Z" }],
    isLoading: false,
    isError: false,
  }),
  useDeleteStatusMutation: () => ({ mutateAsync }),
}));

describe("StatusListTable", () => {
  it("requires confirmation before deleting a status entry", async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValue(undefined);

    render(
      <ToastProvider>
        <StatusListTable />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("dialog", { name: "Are you sure?" })).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Yes, delete it!" }));
    expect(mutateAsync).toHaveBeenCalledWith("status-1");
    await waitFor(() => {
      expect(screen.getByText('Status "Active" was deleted successfully.')).toBeVisible();
    });
  });

  it("shows a danger notification when a confirmed deletion fails", async () => {
    const user = userEvent.setup();
    mutateAsync.mockRejectedValueOnce(new Error("Delete failed"));

    render(
      <ToastProvider>
        <StatusListTable />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Yes, delete it!" }));

    await waitFor(() => {
      expect(screen.getByText("Could not delete status")).toBeVisible();
    });
    expect(screen.queryByRole("dialog", { name: "Could not delete status" })).not.toBeInTheDocument();
  });
});
