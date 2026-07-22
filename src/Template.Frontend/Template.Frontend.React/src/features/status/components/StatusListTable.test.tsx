import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import { StatusListTable } from "@/features/status/components/StatusListTable";

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

    render(<StatusListTable />);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("dialog", { name: "Are you sure?" })).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Yes, delete it!" }));
    expect(mutateAsync).toHaveBeenCalledWith("status-1");
  });
});
